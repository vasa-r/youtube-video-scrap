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
