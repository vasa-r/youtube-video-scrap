"use client";

import { useAllJobs, useUserVideo } from "@/queries/video";
import React, { useState } from "react";
import ErrorView from "@/components/main/error-view";
import HistoryLoading from "@/components/history/history-loading";
import NoDataFallback from "@/components/main/nodata-fallback";
import HistoryVideoCard from "../history/history-video-card";
import Link from "next/link";
import { Button } from "../ui/button";
import VideoCard from "./video-card";

const AllVideos = () => {
  const [filter, setFilter] = useState<string>("all");
  const { data: videos, isLoading, error, refetch } = useUserVideo();
  console.log({ videos, isLoading, error });
  console.log({ length: videos?.length });

  if (error) {
    return (
      <div className="h-full center">
        <ErrorView refetch={refetch} label="Failed to load your videos" />
      </div>
    );
  }

  if (isLoading || !videos) {
    return (
      <div className="h-full">
        <HistoryLoading />
      </div>
    );
  }

  if (videos?.length === 0) {
    return (
      <div className="h-full center">
        <NoDataFallback label="You haven't processed any video yet" />
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-2.5 overflow-y-auto scroll-smooth">
      <div className="mb-4">
        <Link href="/dashboard/create">
          <Button className="text-base rounded-sm">Add video</Button>
        </Link>
      </div>
      <div className="w-full space-y-2.5">
        {videos.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>
    </div>
  );
};

export default AllVideos;
