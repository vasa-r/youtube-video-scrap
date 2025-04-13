import { JobStatus, VideoInfo } from "@/types/types";
import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  stateBadgeStyle,
  stateCardStyle,
  stateIconStyle,
} from "@/styles/styles";
import Image from "next/image";
import {
  CircleCheckBig,
  CirclePlay,
  CircleX,
  Clock,
  ExternalLink,
  Eye,
  Loader,
  ShieldAlert,
  Timer,
  User,
  Youtube,
} from "lucide-react";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import Link from "next/link";

const stateMessage = {
  waiting: "Queued for processing",
  active: "Processing in progress",
  completed: "Processing completed",
  failed: "Processing failed",
  delayed: "Processing delayed",
};

const stateIcon = {
  waiting: Clock,
  active: Loader,
  completed: CircleCheckBig,
  failed: CircleX,
  delayed: ShieldAlert,
};

const HistoryVideoCard = ({
  id,
  state,
  progress,
  result,
  data,
  showDetails = true,
}: JobStatus & { showDetails: boolean }) => {
  const { videoInfo } = data;
  const Icon = stateIcon[state as keyof typeof stateIcon];
  return (
    <Card
      className={cn(
        "rounded-md p-2 py-5 flex-row space-x-2.5 gap-0 justify-between",
        stateCardStyle[state as keyof typeof stateCardStyle]
      )}
    >
      <div className="relative w-[100px] sm:w-[150px] h-[70px] sm:h-[100px] rounded-sm group shrink-0">
        <Image
          src={videoInfo.thumbnailUrl}
          alt={videoInfo.title}
          fill
          sizes="(max-width: 768px) 100px, 150px"
          className="rounded-sm"
        />
        <div className="absolute inset-0 transition-all duration-300 rounded-sm opacity-0 hover:bg-black/20 center group-hover:opacity-100">
          <CirclePlay className="text-white size-5" />
        </div>
        <div className="absolute size-5 rounded-full bottom-1.5 right-1.5 center">
          <Icon
            className={cn(stateIconStyle[state as keyof typeof stateIconStyle])}
          />
        </div>
      </div>
      <div className="flex flex-col space-y-0.5 md:space-y-2 flex-1">
        <div className="relative flex">
          <div className="space-y-0.5 md:space-y-2 flex flex-col">
            <h1
              className={cn(
                "truncate max-w-[180px] sm:max-w-[300px] md:max-w-[70%] text-lg font-bold"
              )}
            >
              {videoInfo.title}
            </h1>
            {videoInfo.description && (
              <p className="text-sm md:text-base font-medium truncate max-w-[180px] sm:max-w-[300px]">
                {videoInfo.description}
              </p>
            )}
          </div>
          <Badge
            children={stateMessage[state as keyof typeof stateMessage]}
            className={cn(
              stateBadgeStyle[state as keyof typeof stateBadgeStyle],
              "h-fit rounded-full absolute right-1 top-3.5 hidden md:block"
            )}
          />
        </div>
        {progress && state !== "completed" && (
          <div className="flex items-center gap-3">
            <Progress
              value={progress}
              className={cn("mt-1 md:mt-0 md:w-[80%]")}
              state={state}
            />
            <p className="text-xs font-medium md:text-sm">{progress}/100</p>
          </div>
        )}
        {state === "completed" && (
          <div className="flex items-center gap-3 md:gap-5">
            <div className="flex items-center gap-1">
              <Timer className="size-4" />
              <p className="text-xs md:text-sm">
                {Math.ceil(videoInfo.duration / 60)}{" "}
                {Math.ceil(videoInfo.duration / 60) === 1
                  ? "minute"
                  : "minutes"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <User className="size-4" />
              <p className="text-xs md:text-sm">by {videoInfo.author}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-between">
        <Link
          href={videoInfo.videoUrl}
          target="_blank"
          className="flex items-center gap-1 p-1 border rounded-lg cursor-pointer hover:shadow-sm md:p-2"
        >
          <Youtube className="text-red-500 size-5" />
          <p className="hidden text-xs sm:text-sm md:block">View video</p>
        </Link>
        {showDetails && (
          <div className="flex items-center gap-1 p-1 border rounded-lg cursor-pointer hover:shadow-sm md:p-2">
            <Eye className="text-green-500 size-5" />
            <p className="hidden text-xs sm:text-sm md:block">View Details</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default HistoryVideoCard;
