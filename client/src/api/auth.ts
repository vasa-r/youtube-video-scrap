import { apiClient } from "./api-client";

export const authApi = {
  login: async (data: any) => {
    const response = await apiClient.post("/auth/login", data);
    console.log({ response });
    return response.data;
  },

  register: async (data: any) => {
    const response = await apiClient.post("/auth/register", data);
    console.log({ response });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get("/auth/me");
    console.log({ response });
    return response.data;
  },
};
