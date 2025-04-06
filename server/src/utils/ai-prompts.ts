import { VideoInfo } from "../types/types";

export const promptUtilityFn = (
  transcription: string,
  videoInfo?: VideoInfo
): string => {
  let prompt = `You are a video content analyzer. Your task is to analyze the provided video transcription and return a JSON response.

IMPORTANT: Your response must be valid JSON and match this exact structure:
{
  "summary": "2-3 sentences summarizing the main content",
  "keyPoints": ["point 1", "point 2", "etc"],
  "sentiment": "positive|negative|neutral",
  "topics": ["topic1", "topic2", "etc"],
  "tags": ["#tag1", "#tag2", "etc"]
}

DO NOT include any text outside the JSON structure. Your response should be parsable by JSON.parse().

Analyze this transcription:
"""
${transcription}
"""`;

  if (videoInfo) {
    prompt += `\n\nAdditional video context:
Title: "${videoInfo.title}"
Author: "${videoInfo.author}"
Duration: ${videoInfo.duration} seconds`;
  }

  return prompt;
};
