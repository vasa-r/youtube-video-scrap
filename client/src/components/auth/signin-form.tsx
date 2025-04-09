"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schema/zod-schema";
import BtnLoader from "../loader";
import ErrorAlert from "./error-alert";
import { useState } from "react";
import { LoginType } from "@/types/types";
import { useLogin } from "@/queries/auth";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function SigninForm({ className }: React.ComponentProps<"form">) {
  const login = useLogin();
  const [error, setError] = useState<string | null>("");
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }: LoginType) => {
    try {
      setError(null);
      await login.mutateAsync({
        email,
        password,
      });
      toast.success("Welcome back.");
    } catch (error) {
      console.log({ error });
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "Something went wrong. Try again.";
        setError(errorMessage);
        return;
      }
      setError("Something went wrong. Please try again later.");
    }
  };
  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">
            Welcome Back, Let's Get to the Good Part
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        {error && <ErrorAlert error={error} />}
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="*******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button
            type="submit"
            disabled={login.isPending}
            className="w-full text-lg"
          >
            {login.isPending ? <BtnLoader /> : "Login"}
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}
