"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";
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
      toast.success("Alert resolved");
    } catch (err) {
      toast.error("Failed to resolve alert");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight neon-text mb-2">Alert Management</h1>
        <p className="text-muted-foreground">Monitor and resolve system critical alerts.</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="font-mono tracking-widest text-sm text-muted-foreground uppercase">Active Alerts Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No alerts active. System status is nominal.</div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="flex items-start justify-between p-4 rounded-lg border border-white/5 bg-white/5 group hover:bg-white/10 transition-all">
                  <div className="flex gap-4">
                    <div className={`mt-1 p-2 rounded-full ${alert.severity === 'CRITICAL' ? 'bg-destructive/20 text-destructive' : 'bg-chart-4/20 text-chart-4'}`}>
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className={`font-bold ${alert.severity === 'CRITICAL' ? 'text-destructive' : 'text-chart-4'}`}>{alert.severity}</h4>
                      <p className="text-sm text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{new Date(alert.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {alert.resolved ? (
                    <span className="text-xs text-chart-3 font-mono">RESOLVED</span>
                  ) : (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <CheckCircle className="h-6 w-6" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}