"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import api from "@/lib/api";

interface Reading { timestamp: string; value: number; sensor_type: string; unit: string; }

export default function AnalyticsPage() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.get("/sensors/history?limit=50").catch(() => ({ data: [] })),
      api.get("/alerts").catch(() => ({ data: [] })),
    ]).then(([sensorRes, alertRes]) => {
      setReadings(sensorRes.data || []);
      setAlerts(alertRes.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const temps = readings.filter(r => r.sensor_type?.toLowerCase() === "temperature");
  const hums = readings.filter(r => r.sensor_type?.toLowerCase() === "humidity");
  const avgTemp = temps.length ? (temps.reduce((a,b) => a+b.value,0)/temps.length).toFixed(1) : null;
  const avgHum = hums.length ? (hums.reduce((a,b) => a+b.value,0)/hums.length).toFixed(1) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight neon-text mb-2">Historical Analytics</h1>
        <p className="text-muted-foreground text-sm">Detailed performance analysis and historical trends.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-mono uppercase text-muted-foreground">Avg. Temperature</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-primary">{loading ? "..." : avgTemp ? avgTemp + "C" : "No data"}</div></CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-mono uppercase text-muted-foreground">Avg. Humidity</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-chart-3">{loading ? "..." : avgHum ? avgHum + "%" : "No data"}</div></CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-mono uppercase text-muted-foreground">Total Alerts</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-yellow-500">{loading ? "..." : alerts.length}</div></CardContent>
        </Card>
      </div>
      <Card className="glass">
        <CardHeader><CardTitle className="text-sm sm:text-base">Recent Sensor Readings</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
              <Activity className="h-5 w-5 mr-2 animate-pulse text-primary"/> Loading...
            </div>
          ) : readings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm">
              <Activity className="h-8 w-8 mb-2 animate-pulse text-primary"/>
              <p>No sensor history yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead><tr className="border-b border-white/10 text-muted-foreground">
                  <th className="text-left py-2 pr-4">Type</th>
                  <th className="text-left py-2 pr-4">Value</th>
                  <th className="text-left py-2 pr-4">Unit</th>
                  <th className="text-left py-2">Time</th>
                </tr></thead>
                <tbody>{readings.slice(0,15).map((r,i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 pr-4 font-mono uppercase text-primary text-xs">{r.sensor_type}</td>
                    <td className="py-2 pr-4 font-bold">{r.value.toFixed(2)}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{r.unit}</td>
                    <td className="py-2 text-muted-foreground text-xs">{new Date(r.timestamp).toLocaleString()}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
