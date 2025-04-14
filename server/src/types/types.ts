import { JwtPayload } from "jsonwebtoken";
import { User } from "../entities/user-entity";

export enum statusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  CONFLICT = 409,
  SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  UNAVAILABLE = 503,
  TIMEOUT = 504,
}

export interface EmailTemplateContent {
  title: string;
  body: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

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

export type YoutubeDLOutput = {
  title: string;
  description?: string;
  duration: number;
  uploader: string;
  thumbnail: string;
} & Record<string, unknown>;

export interface JwtPayloadWithUser extends JwtPayload {
  userId: string;
  userEmail: string;
  userName: string;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  isMusic?: boolean;
}

export interface TranscriptionJob {
  url: string;
  videoInfo?: any;
  userId: string;
}

export interface AiAnalysis {
  summary: string;
  keyPoints: string[];
  sentiment: "positive" | "negative" | "neutral";
  topics: string[];
  tags: string[];
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
