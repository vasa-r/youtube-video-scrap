import React from "react";
import { Card } from "../ui/card";
import TooltipWrapper from "../tooltip-wrapper";
import { BadgeInfo } from "lucide-react";
import { Separator } from "../ui/separator";
import { DetailBadge } from "./video-details";

const Transcription = ({ transcription }: { transcription: string }) => {
  if (!transcription) {
    return (
      <div className="h-full w-full border rounded-md center">
        <p className="font-medium text-lg">
          Not transcribed yet. Check back after completion.
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full h-full overflow-y-auto scroll-smooth space-y-4 pb-4">
      {/* <h1 className="text-lg font-bold text-green-500 underline sm:text-2xl md:text-4xl underline-offset-4 decoration-dashed">
        Video Transcription
      </h1> */}
      <Card className="flex flex-col gap-2 rounded-md p-3">
        <div className="flex items-center gap-1">
          <h3 className="text-base font-medium">Video Transcription</h3>
          <TooltipWrapper content="This is whole transcription of the video">
            <BadgeInfo className="size-2.5 text-red-500" />
          </TooltipWrapper>
        </div>
        <Separator />
        <DetailBadge
          desc={
            transcription === ""
              ? "No transcription for this video"
              : transcription
          }
          showSpace
        />
      </Card>
      {/* <p className="text-sm font-normal sm:text-base text-neutral-600">
        {transcription === ""
          ? "No transcription for this video"
          : transcription}
      </p> */}
    </div>
  );
};

export default Transcription;
