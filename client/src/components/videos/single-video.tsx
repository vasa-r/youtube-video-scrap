"use client";

import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Info, Notebook } from "lucide-react";
import { useVideoById } from "@/queries/video";
import ErrorView from "../main/error-view";
import Image from "next/image";
import { truncate } from "@/lib/utils";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "../ui/tabs";
import Transcription from "./transcription";
import AiAnalysis from "./ai-analysis";
import VideoDetails from "./video-details";
import { Skeleton } from "../ui/skeleton";
import NoDataFallback from "../main/nodata-fallback";

interface SingleVideoProp {
  videoId: string;
}

const SingleVideo = ({ videoId }: SingleVideoProp) => {
  const { data: video, error, refetch, isLoading } = useVideoById(videoId);
  console.log({ video });

  if (error) {
    return <ErrorView label="Failed to load video info" refetch={refetch} />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full space-y-3">
        <Skeleton className="h-9 w-[105px]" />
        <Skeleton className="h-[102px] w-full" />
        <Skeleton className="h-9 w-[406px]" />
        <Skeleton className="flex-1 w-full" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="center flex-1">
        <NoDataFallback label="No videos yet" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-3">
      <Link href="/dashboard/videos">
        <Button variant="outline">
          <ArrowLeft />
          Go back
        </Button>
      </Link>

      <div className="flex items-stretch p-2 border border-dashed rounded-md border-border bg-gradient-to-r from-green-100/50 to-green-50/50">
        <div className="relative w-[90px] h-[80px] rounded-md">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 90px, 150px"
            className="rounded-sm"
          />
        </div>
        <div className="flex flex-col flex-1 ml-1">
          <h1 className="text-base font-medium sm:hidden">
            {truncate(video.title, 28)}
          </h1>
          <h1 className="hidden text-base font-medium sm:block">
            {truncate(video.title)}
          </h1>
          <p className="text-xs font-light text-neutral-500 sm:hidden">
            {truncate(video.description, 120)}
          </p>
          <p className="hidden max-w-4xl text-sm font-light text-neutral-500 sm:block">
            {truncate(video.description, 220)}
          </p>
        </div>
      </div>

      <div className="flex-1 w-full">
        <Tabs defaultValue="transcription" className="w-full h-full">
          <TabsList>
            <TabsTrigger value="transcription">
              <Notebook /> <p className="hidden sm:block">Transcription</p>{" "}
              <p className="sm:hidden">Transcript</p>
            </TabsTrigger>
            <TabsTrigger value="analysis">
              <Brain /> <p className="hidden sm:block">AI Analysis</p>{" "}
              <p className="sm:hidden">Summary</p>
            </TabsTrigger>
            <TabsTrigger value="info">
              <Info /> <p className="hidden sm:block">Video Details</p>{" "}
              <p className="sm:hidden">Details</p>
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="transcription"
            className="overflow-y-auto scroll-smooth"
          >
            <Transcription
              transcription={
                video.transcription?.text ? video.transcription.text : ""
              }
            />
          </TabsContent>
          <TabsContent value="analysis">
            <AiAnalysis analysis={video.analysis} />
          </TabsContent>
          <TabsContent value="info">
            <VideoDetails {...video} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SingleVideo;
