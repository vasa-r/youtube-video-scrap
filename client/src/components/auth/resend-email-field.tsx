import { useResendEmailVerification } from "@/queries/auth";
import { resendEmailSchema } from "@/schema/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "@/lib/utils";
import { ResendEmailType } from "@/types/types";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import BtnLoader from "../loader";

const ResendEmailField = () => {
  const resendEmail = useResendEmailVerification();
  const form = useForm({
    resolver: zodResolver(resendEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }: ResendEmailType) => {
    try {
      await resendEmail.mutateAsync({
        email,
      });
      toast.success(
        "Email verification link sent to your email. Please verify",
        { duration: 7000 }
      );
    } catch (error) {
      console.log({ error });
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "Something went wrong. Try again.";
        toast.error(errorMessage);
        return;
      }
    }
  };
  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6 w-full")}
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
      >
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
        <Button
          className="text-base text-black"
          type="submit"
          disabled={resendEmail.isPending}
        >
          {resendEmail.isPending ? <BtnLoader /> : "Resend verification code"}
        </Button>
      </form>
    </Form>
  );
};

export default ResendEmailField;
