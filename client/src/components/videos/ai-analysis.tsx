import React from "react";
import { Card } from "../ui/card";
import { Video } from "@/types/types";
import { ArrowRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { formatUTC } from "@/lib/utils";

interface AiAnalysisProp {
  analysis: Video["analysis"];
}

const AiAnalysis = ({ analysis }: AiAnalysisProp) => {
  return (
    <Card className="flex flex-col w-full h-full p-3 overflow-y-auto scroll-smooth">
      <h1 className="text-lg font-bold text-green-500 underline sm:text-2xl md:text-4xl underline-offset-4 decoration-dashed">
        Video Analysis
      </h1>
      <div className="flex flex-col gap-1.5 w-full xl:max-w-[70%]">
        <h2 className="text-base font-medium sm:text-lg">Summary</h2>
        <p className="text-sm font-normal sm:text-base text-neutral-600">
          {analysis?.summary}
        </p>
      </div>
      <div className="flex flex-col gap-1.5 w-full xl:max-w-[70%]">
        <h2 className="text-base font-medium sm:text-lg">Key Points</h2>
        {analysis?.keyPoints.map((point, idx) => (
          <div className="flex gap-1" key={idx}>
            {/* <p className="font-medium">
              {idx + 1}
              {") "}
            </p>{" "} */}
            <ArrowRight className="self-center text-green-500 size-5" />
            <p className="text-sm font-normal sm:text-base text-neutral-600">
              {point}
            </p>
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 w-full xl:max-w-[70%] items-center">
        <h2 className="font-medium">Sentiment: </h2>
        <Badge
          children={analysis?.sentiment}
          className="p-0 px-1 text-base text-center text-black bg-green-300 border border-green-500"
        />
      </div>
      <div className="flex flex-col gap-1.5 w-full xl:max-w-[70%]">
        <h2 className="text-base font-medium sm:text-lg">Topics</h2>
        <div className="flex flex-wrap items-center gap-2">
          {analysis?.topics.map((topic, idx) => (
            <div
              key={idx}
              className="px-1 border rounded-lg border-violet-600 bg-gradient-to-r from-violet-200/50 via-violet-100 to-violet-200/50"
            >
              {topic}
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:gap-1">
        <div className="flex flex-wrap gap-1 max-w-[70%]">
          {analysis?.tags.map((tag) => (
            <p key={tag}>{tag}</p>
          ))}
        </div>
        <div className="flex items-center gap-2 ">
          <p className="font-medium">Analyzed On: </p>
          {formatUTC(analysis!.createdAt)}
        </div>
      </div>
    </Card>
  );
};

export default AiAnalysis;
