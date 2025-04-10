import LinkForm from "@/components/dashboard/link-submit-form";
import TooltipWrapper from "@/components/tooltip-wrapper";
import { TriangleAlert } from "lucide-react";
import React from "react";

const Dashboard = () => {
  return (
    <div className="space-y-2 p-5 flex flex-col h-full">
      <div className="flex items-center gap-2">
        <h1 className="text-xl sm:text-4xl font-bold">
          Process any YouTube Link
        </h1>
        <TooltipWrapper content="English videos only (for now). Multi-language support coming soon!">
          <TriangleAlert className="text-yellow-500 size-5" />
        </TooltipWrapper>
      </div>

      <p className="text-muted-foreground mt-2 text-base max-w-xl">
        Just paste your video URL — our system works in the background to fetch
        data, transcribe, summarize, or analyze the content. No waiting, no
        hassle.
      </p>
      <div className="flex-1 center">
        <LinkForm />
      </div>
    </div>
  );
};

export default Dashboard;
