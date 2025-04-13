import React from "react";
import { Card } from "../ui/card";

const Transcription = ({ transcription }: { transcription: string }) => {
  return (
    <Card className="flex flex-col w-full h-full p-3 overflow-y-auto scroll-smooth">
      <h1 className="text-lg font-bold text-green-500 underline sm:text-2xl md:text-4xl underline-offset-4 decoration-dashed">
        Video Transcription
      </h1>
      <p className="text-sm font-normal sm:text-base text-neutral-600">
        {transcription === ""
          ? "No transcription for this video"
          : transcription}
      </p>
    </Card>
  );
};

export default Transcription;
