import {
  GenerateContentRequest,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import { envConfig } from "../config/env-config";
import { promptUtilityFn } from "../utils/ai-prompts";
import { AiAnalysis, statusCode, VideoInfo } from "../types/types";
import { AppError } from "../utils/error";

export class GeminiService {
  private static readonly genAI = new GoogleGenerativeAI(
    envConfig.gemini.apiKey
  );
  private static readonly model = GeminiService.genAI.getGenerativeModel({
    model: "gemini-2.0-flash", //gemini-2.0-flash
  });

  private static generatePrompt(
    transcription: string,
    videoInfo?: VideoInfo
  ): string {
    let prompt = promptUtilityFn(transcription, videoInfo);
    return prompt;
  }

  static async analyzeTranscription(
    transcription: string,
    videoInfo: VideoInfo
  ): Promise<AiAnalysis> {
    const prompt = GeminiService.generatePrompt(transcription, videoInfo);
    const generateConfig: GenerateContentRequest = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1500,
      },
    };

    const result = await this.model.generateContent(generateConfig);
    const response = result.response;
    const text = response.text();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;

      const analysis = JSON.parse(jsonStr) as AiAnalysis;

      if (
        !analysis.summary ||
        !Array.isArray(analysis.keyPoints) ||
        !analysis.sentiment
      ) {
        throw new AppError(statusCode.BAD_REQUEST, "Invalid response format");
      }

      if (!["positive", "negative", "neutral"].includes(analysis.sentiment)) {
        analysis.sentiment = "neutral";
      }

      return {
        summary: analysis.summary,
        keyPoints: analysis.keyPoints || [],
        sentiment: analysis.sentiment as "positive" | "negative" | "neutral",
        topics: analysis.topics || [],
        tags: analysis.tags || [],
      };
    } catch (error) {
      throw new AppError(statusCode.BAD_REQUEST, "Invalid response format");
    }
  }
}
