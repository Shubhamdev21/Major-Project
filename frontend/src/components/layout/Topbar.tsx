"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/useStore";
import api from "@/lib/api";

export default function Topbar() {
  const router = useRouter();
  const [user, setUser] = useState<{name: string, role: string} | null>(null);
  const [mounted, setMounted] = useState(false);
  const alerts = useStore((state) => state.alerts);
  const unreadAlerts = alerts.filter(a => !a.resolved).length;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await api.get('/auth/profile');
        setUser(res.data);
      } catch (err) {
        router.push('/login');
      }
    };
    fetchUser();
    setMounted(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1">
        <div className="text-sm font-mono text-muted-foreground hidden lg:block">
          {mounted ? new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC' : ''}
        </div>
        
        <div className="relative max-w-md w-full ml-4 hidden md:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input 
            type="text"
            placeholder="Search system metrics, alerts, or sensors..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative cursor-pointer">
          <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          {unreadAlerts > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] animate-pulse">
              {unreadAlerts}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 border-l border-white/10 pl-4">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium">{user?.name || 'Operator'}</span>
            <span className="text-xs text-primary neon-text font-mono">{user?.role || 'USER'}</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={handleLogout} className="ml-2 hover:bg-destructive/20 hover:text-destructive">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
