"use client";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function AlertsPage() {
  const { alerts, setAlerts } = useStore();

  useEffect(() => {
    api.get('/alerts').then(res => setAlerts(res.data)).catch(console.error);
  }, [setAlerts]);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight neon-text mb-2">Alert Management</h1>
        <p className="text-muted-foreground text-sm">Monitor and resolve system critical alerts.</p>
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
        <CardHeader className="pb-3">
          <CardTitle className="font-mono tracking-widest text-sm text-muted-foreground uppercase">
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
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start justify-between p-4 hover:bg-white/5 transition-all gap-3">
                  <div className="flex gap-3 flex-1 min-w-0">
                    <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold ${alert.severity === 'CRITICAL' ? 'text-red-500' : 'text-yellow-500'}`}>
                          {alert.severity}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${alert.resolved ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {alert.resolved ? 'RESOLVED' : 'OPEN'}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-0.5 line-clamp-2">{alert.message}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {new Date(alert.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-500 text-xs font-medium transition-colors border border-green-500/20"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Resolve</span>
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
