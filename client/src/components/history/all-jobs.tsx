"use client";

import { useAllJobs } from "@/queries/video";
import React, { useState } from "react";
import ErrorView from "@/components/main/error-view";
import HistoryLoading from "@/components/history/history-loading";
import NoDataFallback from "@/components/main/nodata-fallback";
import HistoryVideoCard from "./history-video-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card } from "../ui/card";

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

  const filteredJobs = jobs.filter((job) => {
    if (filter === "all") return true;
    if (filter === "active") {
      return job.state === "active" || job.state === "waiting";
    }
    return job.state === filter;
  });

  return (
    <div className="w-full h-full space-y-2.5 overflow-y-auto scroll-smooth">
      <div className="mb-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" defaultValue="all" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            <SelectItem value="active">Active Jobs</SelectItem>
            <SelectItem value="completed">Completed Jobs</SelectItem>
            <SelectItem value="failed">Failed Jobs</SelectItem>
            <SelectItem value="delayed">Delayed Jobs</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {filteredJobs.map((job) => (
        <HistoryVideoCard key={job.id} {...job} showDetails />
      ))}
    </div>
  );
};

export default AllJobs;
