"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
import { JobStatus } from "@/types/types";
import { progressStyle } from "@/styles/styles";

function Progress({
  className,
  value,
  state,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  state: JobStatus["state"];
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-1.5 md:h-2 w-full overflow-hidden rounded-full",
        `bg-white`,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 transition-all",
          progressStyle[state as keyof typeof progressStyle]
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
