"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setMounted(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Check if token is valid
        await api.get("/auth/profile");
        setAuthorized(true);
      } catch (err) {
        console.error("Auth validation failed", err);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (!mounted || !authorized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest animate-pulse">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
