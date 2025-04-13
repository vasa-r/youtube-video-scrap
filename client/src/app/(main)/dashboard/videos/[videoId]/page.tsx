import SingleVideo from "@/components/videos/single-video";
import React from "react";

interface VideoResultProps {
  params: {
    videoId: string;
  };
}

const VideoResult = async ({ params }: VideoResultProps) => {
  const { videoId } = await params;

  return (
    <div className="flex flex-col h-full p-5 space-y-2">
      <SingleVideo videoId={videoId} />
    </div>
  );
};

export default VideoResult;
