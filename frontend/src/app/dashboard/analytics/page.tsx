"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import api from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Reading { timestamp: string; value: number; sensor_type: string; }

export default function AnalyticsPage() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ avgTemp: 0, avgHumidity: 0, alertFreq: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sensorRes, alertRes] = await Promise.all([
          api.get("/sensors/history?limit=50"),
          api.get("/alerts"),
        ]);
        const data: Reading[] = sensorRes.data || [];
        setReadings(data);
        const temps = data.filter(r => r.sensor_type?.toLowerCase() === "temperature");
        const humidity = data.filter(r => r.sensor_type?.toLowerCase() === "humidity");
        const avgTemp = temps.length ? temps.reduce((a, b) => a + b.value, 0) / temps.length : 0;
        const avgHumidity = humidity.length ? humidity.reduce((a, b) => a + b.value, 0) / humidity.length : 0;
        const alerts = alertRes.data || [];
        setStats({ avgTemp, avgHumidity, alertFreq: alerts.length });
      } catch (err) {
        console.error("Analytics fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = readings.slice(0, 20).reverse().map((r, i) => ({
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    value: r.value,
    type: r.sensor_type,
  }));

  const tempData = readings.filter(r => r.sensor_type?.toLowerCase() === "temperature").slice(0, 20).reverse();
  const humidityData = readings.filter(r => r.sensor_type?.toLowerCase() === "humidity").slice(0, 20).reverse();

  const mergedChart = tempData.map((t, i) => ({
    time: new Date(t.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    temperature: parseFloat(t.value.toFixed(1)),
    humidity: humidityData[i] ? parseFloat(humidityData[i].value.toFixed(1)) : null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight neon-text mb-2">Historical Analytics</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Detailed performance analysis and historical trends.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Avg. Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {loading ? "..." : stats.avgTemp ? `${stats.avgTemp.toFixed(1)}°C` : "No data"}
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Avg. Humidity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-chart-3">
              {loading ? "..." : stats.avgHumidity ? `${stats.avgHumidity.toFixed(1)}%` : "No data"}
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-yellow-500">
              {loading ? "..." : stats.alertFreq}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">Temperature & Humidity Trends</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
              <Activity className="h-5 w-5 mr-2 animate-pulse text-primary" /> Loading data...
            </div>
          ) : mergedChart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-sm">
              <Activity className="h-8 w-8 mb-2 animate-pulse text-primary" />
              <p>Waiting for sensor history...</p>
              <p className="text-xs mt-1">Data will appear once sensors start reporting</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={mergedChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="rgba(255,255,255,0.3)" />
                <YAxis tick={{ fontSize: 10 }} stroke="rgba(255,255,255,0.3)" />
                <Tooltip contentStyle={{ background: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#3b82f6" strokeWidth={2} dot={false} name="Temp (°C)" />
                <Line type="monotone" dataKey="humidity" stroke="#22c55e" strokeWidth={2} dot={false} name="Humidity (%)" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">Recent Sensor Readings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : readings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No historical data yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground">
                    <th className="text-left py-2 pr-4">Type</th>
                    <th className="text-left py-2 pr-4">Value</th>
                    <th className="text-left py-2 pr-4">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {readings.slice(0, 10).map((r, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-2 pr-4 font-mono uppercase text-primary text-xs">{r.sensor_type}</td>
                      <td className="py-2 pr-4 font-bold">{r.value.toFixed(2)}</td>
                      <td className="py-2 text-muted-foreground">{new Date(r.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
