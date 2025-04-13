import { formatUTC, truncate } from "@/lib/utils";
import { Video } from "@/types/types";
import {
  Brain,
  CalendarCheck,
  CheckCheck,
  Eye,
  NotebookText,
  Timer,
  User,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const VideoCard = ({
  thumbnail,
  url,
  title,
  description,
  duration,
  createdAt,
  author,
}: Video) => {
  console.log({ createdAt });
  return (
    <div className="flex flex-col gap-1.5 md:gap-0 items-stretch justify-between w-full p-2 py-4 overflow-hidden border border-green-500 rounded-md md:flex-row h-fit bg-gradient-to-r from-green-100/50 to-green-50/50">
      <div className="relative w-full md:w-[150px] h-[150px] md:h-[100px] rounded-sm group shrink-0">
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="(max-width: 768px) 100px, 150px"
          className="rounded-sm"
        />
      </div>
      <div className="flex flex-col gap-1.5 justify-between flex-1 p-1 overflow-hidden md:p-2">
        <h1 className="w-full text-lg font-bold ">{truncate(title)}</h1>
        <p className="text-sm">{truncate(description, 80)}</p>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <Timer className="size-4 text-[#6d4c41]" />
            <p className="text-xs md:text-sm">
              {Math.ceil(duration / 60)}{" "}
              {Math.ceil(duration / 60) === 1 ? "minute" : "minutes"}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <User className="size-4 text-rose-500" />
            <p className="text-xs md:text-sm">by {author}</p>
          </div>
          <div className="flex items-center gap-1">
            <CalendarCheck className="text-violet-500 size-4" />
            <p className="text-xs md:text-sm">{formatUTC(createdAt)}</p>
          </div>

          <div className="flex items-center gap-1.5 border border-green-300 rounded-md p-1 shadow-xs">
            <NotebookText className="text-green-500 size-4" />
            <p className="text-xs md:text-sm">Transcription</p>
            <CheckCheck className="text-green-500 size-4" />
          </div>
          <div className="flex items-center gap-1.5 border border-green-300 rounded-md p-1 shadow-xs">
            <Brain className="text-green-500 size-4" />
            <p className="text-xs md:text-sm">AI Analysis</p>
            <CheckCheck className="text-green-500 size-4" />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between md:flex-col">
        <Link
          href={url}
          target="_blank"
          className="flex items-center gap-1 p-1 border rounded-md cursor-pointer w-fit hover:shadow-sm md:px-2"
        >
          <Youtube className="text-red-500 size-5" />
          <p className="text-xs sm:text-sm">View video</p>
        </Link>

        <div className="flex items-center gap-1 p-1 border rounded-md cursor-pointer w-fit hover:shadow-sm md:px-2">
          <Eye className="text-green-500 size-5" />
          <p className="text-xs sm:text-sm">See Insights</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
