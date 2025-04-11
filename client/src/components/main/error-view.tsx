import { ShieldX } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

type ErrorViewProps = {
  label: string;
  refetch: () => void | Promise<unknown>;
};

const ErrorView = ({ label, refetch }: ErrorViewProps) => {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <ShieldX className="size-10 text-red-500" />
      <p className="text-red-500">{label}. Try again later.</p>
      <Button className="bg-red-500" onClick={refetch}>
        Refetch history
      </Button>
    </div>
  );
};

export default ErrorView;
