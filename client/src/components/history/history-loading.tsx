import React from "react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const HistoryLoading = () => {
  return (
    <div className="h-full space-y-2 flex flex-col">
      {[...Array(6)].map((_, idx) => (
        <Skeleton key={idx} className="flex-1 rounded-lg" />
      ))}
    </div>
  );
};

export default HistoryLoading;
