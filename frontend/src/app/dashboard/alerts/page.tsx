"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function AlertsPage() {
  const { alerts, setAlerts } = useStore();
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    api.get('/alerts').then(res => {
      setAlerts(res.data);
      setVisibleCount(0);
    }).catch(console.error);
  }, [setAlerts]);

  // Stagger alerts one by one every 300ms
  useEffect(() => {
    if (visibleCount >= alerts.length) return;
    const timer = setTimeout(() => {
      setVisibleCount(v => v + 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [visibleCount, alerts.length]);

  // When new alert arrives via socket, show it immediately
  useEffect(() => {
    if (alerts.length > visibleCount) {
      setVisibleCount(alerts.length);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerts.length]);

  const resolveAlert = async (id: string) => {
    try {
      await api.patch(`/alerts/${id}/resolve`);
      setAlerts(alerts.map(a => a.id === id ? { ...a, resolved: true } : a));
      toast.success("Alert resolved successfully");
    } catch (err) {
      toast.error("Failed to resolve alert");
    }
  };

  const unresolvedAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);
  const visibleAlerts = alerts.slice(0, visibleCount);

  return (
    <div className="space-y-4 sm:space-y-6 pb-24">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight neon-text mb-1 sm:mb-2">Alert Management</h1>
        <p className="text-muted-foreground text-xs sm:text-sm">Monitor and resolve system critical alerts.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="glass border border-red-500/20">
          <CardContent className="pt-4 pb-4 px-4">
            <p className="text-xs text-muted-foreground mb-1">Unresolved</p>
            <p className="text-2xl font-bold text-red-500">{unresolvedAlerts.length}</p>
          </CardContent>
        </Card>
        <Card className="glass border border-green-500/20">
          <CardContent className="pt-4 pb-4 px-4">
            <p className="text-xs text-muted-foreground mb-1">Resolved</p>
            <p className="text-2xl font-bold text-green-500">{resolvedAlerts.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <CardTitle className="font-mono tracking-widest text-xs sm:text-sm text-muted-foreground uppercase">
            Active Alerts Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              No alerts active. System status is nominal.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {visibleAlerts.map((alert, index) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between p-3 sm:p-4 hover:bg-white/5 transition-all gap-2 sm:gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className={`mt-0.5 p-1 sm:p-1.5 rounded-full shrink-0 ${alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                      <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className={`text-[10px] sm:text-xs font-bold ${alert.severity === 'CRITICAL' ? 'text-red-500' : 'text-yellow-500'}`}>
                          {alert.severity}
                        </span>
                        <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold ${alert.resolved ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {alert.resolved ? 'RESOLVED' : 'OPEN'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-foreground mt-0.5 line-clamp-2">{alert.message}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground" />
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground font-mono">
                          {new Date(alert.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="shrink-0 flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-500 text-[10px] sm:text-xs font-medium transition-colors border border-green-500/20 whitespace-nowrap"
                    >
                      <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>Resolve</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
