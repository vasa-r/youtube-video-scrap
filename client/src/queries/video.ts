import { videoApi } from "@/api/video";
import { useQuery } from "@tanstack/react-query";
import { JobStatus, Video } from "@/types/types";

export const useAllJobs = () => {
  return useQuery<JobStatus[]>({
    queryKey: ["jobs"],
    queryFn: videoApi.getAllJobs,
    refetchInterval: 5000, // just polling for 5 sec to check new jobs
  });
};

export const useJobStatus = (jobId: string) => {
  return useQuery({
    queryKey: ["job-status", jobId],
    queryFn: () => videoApi.getJobStatus(jobId),
    refetchInterval: (query) => {
      const data = query.state.data as JobStatus | undefined;
      console.log("Polling state", data?.state);
      if (data?.state === "waiting" || data?.state === "active") {
        return 3000;
      }
      return false;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    enabled: !!jobId,
  });
};

export const useUserVideo = () => {
  return useQuery<Video[]>({
    queryKey: ["video"],
    queryFn: videoApi.getUserVideos,
  });
};

export const useVideoById = (videoId: string) => {
  return useQuery<Video>({
    queryKey: ["video", videoId],
    queryFn: () => videoApi.getVideoById(videoId),
    enabled: !!videoId,
  });
};
