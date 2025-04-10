import { URLType } from "@/types/types";
import { apiClient } from "./api-client";

export const videoApi = {
  processVideo: async (data: URLType) => {
    const response = await apiClient.post("/video/transcribe", data);

    return response.data.data;
  },
};
