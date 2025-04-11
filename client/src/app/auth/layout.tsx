"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard/create");
    }
  }, [user, router]);
  return <div>{children}</div>;
};

export default AuthLayout;
