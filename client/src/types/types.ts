import { registerSchema, loginSchema } from "@/schema/zod-schema";
import { z } from "zod";
export interface User {
  id: number;
  email: string;
  name: string;
  isEmailVerified: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export type loginType = z.infer<typeof loginSchema>;
export type registerType = z.infer<typeof registerSchema>;
