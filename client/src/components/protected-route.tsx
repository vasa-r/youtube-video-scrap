"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLoader from "./page-loader";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("tubescribe_token");

    if (!token) {
      router.push("/auth/signin");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <PageLoader />;

  return <>{children}</>;
}
