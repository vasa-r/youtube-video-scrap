"use client";

import React from "react";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { urlSchema } from "@/schema/zod-schema";
import { cn } from "@/lib/utils";
import { URLType } from "@/types/types";
import { Input } from "../ui/input";
import { Link, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { videoApi } from "@/api/video";
import { toast } from "sonner";

const LinkForm = () => {
  const form = useForm({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });

  const queryClient = useQueryClient();

  const startProcessing = useMutation({
    mutationFn: (data: URLType) => videoApi.processVideo(data),
    onSuccess: (data) => {
      toast.success("Video submitted for processing. chill out.", {
        description: data.videoInfo.title,
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
    onError: (err) => {
      toast.error("Failed to submit video for processing.", {
        description: err.message ? err.message : "",
      });
    },
  });

  const onSubmit = (data: URLType) => {
    try {
      startProcessing.mutateAsync(data);
    } catch (error) {}
  };
  return (
    <div className="p-4 space-y-2 w-[95%] sm:w-[70%]">
      <h1 className="text-2xl font-semibold">YouTube URL</h1>
      <Form {...form}>
        <form
          className={cn("flex flex-col gap-6")}
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        >
          <div className="rounded-md w-full">
            <div className="flex items-center w-full rounded-sm p-1 border border-border">
              <Link className="text-neutral-400 size-5" />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        {...field}
                        className="rounded-sm flex-1 shadow-none border-none p-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button
            className="text-lg w-fit rounded-sm self-end"
            type="submit"
            disabled={startProcessing.isPending}
          >
            {startProcessing.isPending ? (
              <div className="flex items-center gap-1">
                <Loader2 className="size-4 text-white animate-spin" />
                <p className="text-sm">Submitting...</p>
              </div>
            ) : (
              "Start Processing"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LinkForm;
