import {
  registerSchema,
  loginSchema,
  urlSchema,
  resendEmailSchema,
} from "@/schema/zod-schema";
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
export type ResendEmailType = z.infer<typeof resendEmailSchema>;

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
  thumbnail: string;
  title: string;
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
  tags: string[];
  createdAt: string;
}

export interface Video {
  id: number;
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  author: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  transcription: VideoTranscription | null;
  analysis: VideoAnalysis | null;
}

interface Transcription {
  confidence: number;
  isMusic: boolean;
  text: string;
}

interface Analytics {
  keyPoints: string[];
  sentiment: string;
  summary: string;
  tags: string[];
  topics: string[];
}

interface JobStatusResultType {
  videoInfo?: VideoInfo;
  transcription?: Transcription;
  analytics?: Analytics;
  status: string;
}

export interface JobStatus {
  id: string;
  state: "completed" | "waiting" | "active" | "delayed" | "failed" | "paused";
  progress: number;
  data: {
    url: string;
    userId: string;
    videoInfo: VideoInfo;
  };
  timestamp: number;
  processedOn: number;
  finishedOn: number;
  attemptsMade: number;
  result?: JobStatusResultType | null;
  failedReason?: string | null;
  videoStatus?: VideoStatus | null;
  final?: boolean;
}

export interface VideoType {
  author: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  duration: number;
  id: string;
  status: string;
  thumbnail: string;
  title: string;
  transcription: Transcription;
  analysis: Analytics;
  url: string;
}
