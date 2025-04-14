import React from "react";
import { Card } from "../ui/card";
import { BadgeInfo } from "lucide-react";
import TooltipWrapper from "../tooltip-wrapper";
import { cn } from "@/lib/utils";
import { Video } from "@/types/types";
import { Separator } from "../ui/separator";
import { format, parseISO } from "date-fns";

const VideoDetails = ({
  title,
  description,
  author,
  duration,
  status,
  transcription,
  analysis,
}: Video) => {
  return (
    <div className="flex flex-col w-full h-full  overflow-y-auto scroll-smooth space-y-4 pb-4">
      <h1 className="text-lg font-bold text-green-500 underline sm:text-2xl md:text-4xl underline-offset-4 decoration-dashed">
        Video Information
      </h1>
      <Card className="flex flex-col gap-2 rounded-md p-3">
        <div className="flex items-center gap-1">
          <h3 className="text-base font-medium">Video Metadata</h3>
          <TooltipWrapper content="This shows all the details about the youtube video">
            <BadgeInfo className="size-2.5 text-red-500" />
          </TooltipWrapper>
        </div>
        <Separator />
        <DetailBadge title="Video Title" desc={title} />
        <DetailBadge title="Video Description" desc={description} />
        <Separator />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2">
          <DetailBadge title="Uploaded By" desc={author} />
          <DetailBadge
            title="Duration"
            desc={`${Math.ceil(duration / 60)} ${
              Math.ceil(duration / 60) === 1 ? "minute" : "minutes"
            }`}
          />
          <DetailBadge title="Video Status" desc={status} badge />
        </div>
      </Card>
      <Card className="flex flex-col gap-2 rounded-md p-3">
        <div className="flex items-center gap-1">
          <h3 className="text-base font-medium">Transcription Details</h3>
          <TooltipWrapper content="This shows all the details about the transcription of the video">
            <BadgeInfo className="size-2.5 text-red-500" />
          </TooltipWrapper>
        </div>
        <Separator />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2">
          <DetailBadge
            title="Transcription Available"
            desc={!!transcription?.text ? "Yes" : "No"}
          />
          <DetailBadge
            title="isMusic"
            desc={transcription?.isMusic ? "Yes" : "No"}
          />
          <DetailBadge
            title="Confidence"
            desc={`${transcription?.confidence}`}
          />
          <DetailBadge
            title="Transcribed On"
            desc={`${format(parseISO(transcription!.createdAt), "yyyy-MM-dd")}`}
          />
        </div>
      </Card>
      <Card className="flex flex-col gap-2 rounded-md p-3">
        <div className="flex items-center gap-1">
          <h3 className="text-base font-medium">AI Analysis Details</h3>
          <TooltipWrapper content="This shows all the details about the AI analysis of the video">
            <BadgeInfo className="size-2.5 text-red-500" />
          </TooltipWrapper>
        </div>
        <Separator />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2">
          <DetailBadge
            title="Analysis Available"
            desc={!!analysis?.summary ? "Yes" : "No"}
          />
          <DetailBadge
            title="Topics Available"
            desc={analysis?.topics ? "Yes" : "No"}
          />
          <DetailBadge
            title="Analysis Sentiment"
            desc={`${analysis?.sentiment}`}
            badge
          />
          <DetailBadge
            title="Analyzed On"
            desc={`${format(parseISO(analysis!.createdAt), "yyyy-MM-dd")}`}
          />
        </div>
      </Card>
    </div>
  );
};

const DetailBadge = ({
  title,
  desc,
  badge = false,
}: {
  title: string;
  desc: String;
  badge?: boolean;
}) => {
  return (
    <div className="flex flex-col ">
      <h1 className="font-semibold font-yanone text-lg tracking-wider">
        {title}:{" "}
      </h1>
      <p
        className={cn(
          "font-normal text-neutral-600 -mt-1.5",
          badge &&
            "p-1 border border-green-500 bg-gradient-to-r from-green-50 via-green-100 to-green-50 w-fit rounded-4xl mt-0 text-sm text-black font-medium"
        )}
      >
        {desc}
      </p>
    </div>
  );
};

export default VideoDetails;
