import { TriangleAlert } from "lucide-react";
import React from "react";

const ErrorAlert = ({ error }: { error: string }) => {
  return (
    <div className="px-5 py-2 rounded-md bg-red-50 border border-red-300 flex items-center gap-1.5">
      <TriangleAlert className="size-4 text-red-500" />
      <p className="text-sm text-red-500 font-medium">{error}</p>
    </div>
  );
};

export default ErrorAlert;
