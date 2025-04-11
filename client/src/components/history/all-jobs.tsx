"use client";

import { useAllJobs } from "@/queries/video";
import React, { useState } from "react";
import ErrorView from "@/components/main/error-view";
import HistoryLoading from "@/components/history/history-loading";
import NoDataFallback from "@/components/main/nodata-fallback";
import HistoryVideoCard from "./history-video-card";

const AllJobs = () => {
  const [filter, setFilter] = useState<string>("all");
  const { data: jobs, isLoading, error, refetch } = useAllJobs();
  console.log({ jobs, isLoading, error });
  console.log({ length: jobs?.length });

  if (error) {
    return (
      <div className="h-full center">
        <ErrorView refetch={refetch} label="Failed to load history" />
      </div>
    );
  }

  if (isLoading || !jobs) {
    return (
      <div className="h-full">
        <HistoryLoading />
      </div>
    );
  }

  if (jobs?.length === 0) {
    return (
      <div className="h-full center">
        <NoDataFallback label="You haven't processed any video yet" />
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-2">
      {jobs.map((job) => (
        <HistoryVideoCard key={job.id} {...job} />
      ))}
    </div>
  );
};

export default AllJobs;
