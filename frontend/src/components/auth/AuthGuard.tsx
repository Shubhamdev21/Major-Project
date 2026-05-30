"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Activity } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }
      try {
        await api.get("/auth/profile");
        setAuthorized(true);
      } catch (err) {
        localStorage.removeItem("token");
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  if (checking || !authorized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Activity className="h-10 w-10 text-primary neon-text animate-pulse" />
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            {checking ? "Loading..." : "Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
