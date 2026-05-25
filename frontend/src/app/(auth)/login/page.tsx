"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { toast } from "sonner";
import { Activity } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
          <Activity className="h-10 w-10 text-primary neon-text" />
        </div>
        <CardTitle className="text-2xl tracking-tight neon-text">System Access</CardTitle>
        <CardDescription>
          Enter your credentials to access the monitoring platform.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="operator@factory.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50 border-white/10 focus:border-primary focus:ring-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background/50 border-white/10 focus:border-primary focus:ring-primary/50"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full neon-border bg-primary/20 hover:bg-primary/40 text-primary-foreground font-semibold tracking-wider" disabled={loading}>
            {loading ? "AUTHENTICATING..." : "LOGIN"}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account? <Link href="/register" className="text-primary hover:underline">Register</Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
