import AllVideos from "@/components/videos/all-videos";
import React from "react";

const VideosPage = () => {
  return (
    <div className="p-5 h-full space-y-2 flex flex-col ">
      <h1 className="text-xl sm:text-4xl font-bold">Your Finalized Videos</h1>
      <p className="text-muted-foreground mt-2 text-base max-w-2xl">
        Every video here is fully processed — complete with transcriptions and
        AI-powered insights. Dive in to review content, explore analysis, and
        make the most of your uploads.
      </p>
      <div className="flex-1 overflow-y-auto">
        <AllVideos />
      </div>
    </div>
  );
};

export default VideosPage;
