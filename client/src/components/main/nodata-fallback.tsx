import { VideoOff } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface NoDataFallbackProps {
  label: string;
}

const NoDataFallback = ({ label }: NoDataFallbackProps) => {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <VideoOff className="size-10 text-red-500" />
      <p className="text-red-500">{label}.</p>
      <Button variant="outline">
        <Link className="" href={"/dashboard/create"}>
          Upload One
        </Link>
      </Button>
    </div>
  );
};

export default NoDataFallback;
