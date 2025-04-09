"use client";

import { apiClient } from "@/api/api-client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing verification link.");
      router.push("/auth/signin");
      return;
    }
    VerifyMail();
  }, [token]);

  const VerifyMail = async () => {
    try {
      setError(null);
      await apiClient.get(`/auth/verify-email?token=${token}`);
      toast.success("Email verified successfully!");
      router.push("/auth/signin?verified=true");
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "Verification failed.";
        setError(errorMessage);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh w-screen bg-green-50 px-5 md:px-[30%] flex items-center justify-center">
      <Card className="border border-green-500 bg-transparent w-full max-w-md rounded-sm shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Email Verification
          </CardTitle>
          <CardDescription>
            {loading
              ? "Verifying your email..."
              : error
              ? "Verification failed"
              : "Your email has been verified!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center gap-2 text-muted-foreground">
              <Loader2 className="animate-spin h-5 w-5 text-green-500" />
              <span>Checking token...</span>
            </div>
          ) : error ? (
            <p className="text-sm text-red-500 text-center">{error}</p>
          ) : (
            <p className="text-green-600 text-center font-medium">
              Your email is now verified. You can now sign in to your account.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          {!loading && (
            <p>
              Redirecting to sign-in page...
              <span className="animate-pulse ml-1">⏳</span>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail;
