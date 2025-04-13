import { LoginType, RegisterType, ResendEmailType } from "@/types/types";
import { apiClient } from "./api-client";

export const authApi = {
  login: async (data: LoginType) => {
    const response = await apiClient.post("/auth/login", data);
    return response.data.data;
  },

  register: async (data: RegisterType) => {
    const response = await apiClient.post("/auth/register", data);

    return response.data.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get("/auth/me");

    return response.data;
  },

  resendVerificationEmail: async (data: ResendEmailType) => {
    const response = await apiClient.post(
      "/auth/resend-verification-email",
      data
    );

    return response.data.data;
  },
};
