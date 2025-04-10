import { registerSchema, loginSchema, urlSchema } from "@/schema/zod-schema";
import { z } from "zod";
export interface User {
  id: string;
  email: string;
  userName: string;
  isEmailVerified: boolean;
  lastLoginAt: string | Date | null;
  createdAt?: string;
  updatedAt?: string;
}

export type LoginType = z.infer<typeof loginSchema>;
export type RegisterType = z.infer<typeof registerSchema>;
export type URLType = z.infer<typeof urlSchema>;

export interface VideoInfo {
  title: string;
  description?: string;
  duration: number;
  author: string;
  videoUrl: string;
  thumbnailUrl: string;
  audioPath?: string;
}

export interface VideoStatus {
  id: number;
  status: string;
  hasTranscription: boolean;
  hasAnalysis: boolean;
}

export interface JobsListResponse {
  jobs: JobStatus[];
}

export interface VideoTranscription {
  text: string;
  confidence: number;
  isMusic: boolean;
  createdAt: string;
}

export interface VideoAnalysis {
  summary: string;
  keyPoints: string[];
  sentiment: string;
  topics: string[];
  suggestedTags: string[];
  createdAt: string;
}

export interface Video {
  id: number;
  url: string;
  title: string;
  description: string;
  duration: number;
  author: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  transcription: VideoTranscription | null;
  analysis: VideoAnalysis | null;
}

export interface JobStatus {
  id: string;
  state: "waiting" | "active" | "completed" | "failed" | "delayed";
  progress: number;
  result?: {
    videoInfo?: VideoInfo;
    transcription?: {
      text: string;
      segments: Array<{
        start: number;
        end: number;
        text: string;
      }>;
    };
    analysis?: {
      summary: string;
      keyPoints: string[];
      topics: string[];
      suggestedTags: string[];
    };
    error?: string;
    final?: boolean;
  };
  failedReason?: string;
  attemptsMade: number;
  videoStatus?: VideoStatus;
  final: boolean;
}
