import { URLType } from "@/types/types";
import { apiClient } from "./api-client";

export const videoApi = {
  processVideo: async (data: URLType) => {
    const response = await apiClient.post("/video/transcribe", data);

    return response.data.data;
  },
  getJobStatus: async (jobId: string) => {
    const response = await apiClient.get(`/video/transcribe/${jobId}/status`);

    return response.data.data;
  },
  getAllJobs: async () => {
    const response = await apiClient.get("/video/jobs");

    return response.data.data;
  },
  getUserVideos: async () => {
    const response = await apiClient.get("/video");

    return response.data.data;
  },
  getVideoById: async (videoId: string) => {
    const response = await apiClient.get(`/video/${videoId}`);

    return response.data.data;
  },
};
