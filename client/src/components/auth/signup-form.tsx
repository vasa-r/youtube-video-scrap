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
import { registerSchema } from "@/schema/zod-schema";
import BtnLoader from "../loader";
import ErrorAlert from "./error-alert";
import { useState } from "react";
import { useRegister } from "@/queries/auth";
import { RegisterType } from "@/types/types";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function SignupForm({ className }: React.ComponentProps<"form">) {
  const register = useRegister();
  const [error, setError] = useState("");
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async ({ userName, email, password }: RegisterType) => {
    try {
      await register.mutateAsync({
        userName,
        email,
        password,
      });
      toast.success("Please check email and verify.");
    } catch (error) {
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
          <h1 className="text-2xl font-bold">Start Summarizing Smarter</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter required details to get started
          </p>
        </div>
        {error && <ErrorAlert error={error} />}
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input placeholder="User Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
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
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
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
            disabled={register.isPending}
            className="w-full text-lg"
          >
            {register.isPending ? <BtnLoader /> : "Register"}
          </Button>
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/signin" className="underline underline-offset-4">
            Sign In
          </Link>
        </div>
      </form>
    </Form>
  );
}
