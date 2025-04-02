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
