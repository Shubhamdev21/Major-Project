"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Search, User, AlertTriangle, CheckCircle, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/useStore";
import api from "@/lib/api";

export default function Topbar() {
  const router = useRouter();
  const [user, setUser] = useState<{name: string, role: string} | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const alerts = useStore((state) => state.alerts);
  const setAlerts = useStore((state) => state.setAlerts);
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleOpenAlert = () => {
    router.push('/dashboard/alerts');
    setShowNotifications(false);
  };

  const handleClearAll = async () => {
    try {
      await api.delete('/alerts/delete-all');
      setAlerts([]);
    } catch (err) {
      // fallback: just clear from UI
      setAlerts([]);
    }
  };

  return (
    <header className="h-14 sm:h-16 glass border-b border-white/10 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2 flex-1 ml-10 lg:ml-0">
        <div className="text-[10px] sm:text-sm font-mono text-muted-foreground hidden lg:block whitespace-nowrap">
          {mounted ? new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC' : ''}
        </div>
        <div className="relative max-w-xs sm:max-w-md w-full ml-2 hidden md:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search system metrics, alerts, or sensors..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-4">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            {unreadAlerts > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] animate-pulse">
                {unreadAlerts > 9 ? '9+' : unreadAlerts}
              </Badge>
            )}
          </button>

          {showNotifications && (
            <div className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-14 sm:top-12 sm:w-80 glass border border-white/10 rounded-xl shadow-2xl z-[100] overflow-hidden mx-auto sm:mx-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">Notifications</span>
                  {unreadAlerts > 0 && (
                    <Badge variant="destructive" className="text-[10px]">{unreadAlerts} unread</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {alerts.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-red-400 transition-colors px-1.5 py-0.5 rounded hover:bg-red-500/10"
                      title="Clear all notifications"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Clear all</span>
                    </button>
                  )}
                  <button onClick={() => setShowNotifications(false)}>
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              </div>

              <div className="max-h-64 sm:max-h-72 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm">
                    <CheckCircle className="h-6 w-6 mb-2 text-green-500" />
                    <p>No notifications</p>
                    <p className="text-xs">System is running normally</p>
                  </div>
                ) : (
                  alerts.slice(0, 10).map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors">
                      <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${alert.severity === 'CRITICAL' ? 'text-red-500' : 'text-yellow-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground line-clamp-2">{alert.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                          {new Date(alert.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!alert.resolved ? (
                        <button onClick={handleOpenAlert} className="text-[10px] font-bold text-red-500 hover:text-red-400 hover:underline shrink-0 cursor-pointer">
                          OPEN
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-green-500 shrink-0">OK</span>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between">
                <button onClick={handleOpenAlert} className="text-xs text-primary hover:underline py-1">
                  View all alerts →
                </button>
                {alerts.length > 10 && (
                  <span className="text-[10px] text-muted-foreground">{alerts.length - 10} more</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-l border-white/10 pl-2 sm:pl-4">
          <div className="flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium">{user?.name || 'Operator'}</span>
            <span className="text-xs text-primary neon-text font-mono">{user?.role || 'USER'}</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-destructive/20 hover:text-destructive">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
