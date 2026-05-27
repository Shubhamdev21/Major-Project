"use client";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, Thermometer, Wind, Droplets, Zap } from "lucide-react";

const sensorIcons: Record<string, React.ElementType> = {
  temperature: Thermometer,
  humidity: Droplets,
  gas: Wind,
  power: Zap,
  default: Activity,
};

export default function OverviewPage() {
  const { sensors, alerts } = useStore();
  const sensorList = Object.values(sensors);
  const activeAlerts = alerts.filter((a) => !a.resolved);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight neon-text mb-2">System Overview</h1>
        <p className="text-muted-foreground text-sm">Real-time industrial monitoring dashboard.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="glass border border-primary/20">
          <CardHeader className="p-3"><CardTitle className="text-xs text-muted-foreground">Active Sensors</CardTitle></CardHeader>
          <CardContent className="p-3 pt-0"><div className="text-3xl font-bold text-primary neon-text">{sensorList.length}</div></CardContent>
        </Card>
        <Card className="glass border border-destructive/20">
          <CardHeader className="p-3"><CardTitle className="text-xs text-muted-foreground">Active Alerts</CardTitle></CardHeader>
          <CardContent className="p-3 pt-0"><div className="text-3xl font-bold text-destructive">{activeAlerts.length}</div></CardContent>
        </Card>
        <Card className="glass border border-chart-3/20">
          <CardHeader className="p-3"><CardTitle className="text-xs text-muted-foreground">System Status</CardTitle></CardHeader>
          <CardContent className="p-3 pt-0"><div className="text-xl font-bold text-chart-3 neon-text flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-chart-3 animate-pulse" />ONLINE</div></CardContent>
        </Card>
        <Card className="glass border border-primary/20">
          <CardHeader className="p-3"><CardTitle className="text-xs text-muted-foreground">Normal Readings</CardTitle></CardHeader>
          <CardContent className="p-3 pt-0"><div className="text-3xl font-bold text-primary neon-text">{sensorList.filter((s) => s.status === "NORMAL").length}</div></CardContent>
        </Card>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-3">Live Sensor Readings</h2>
        {sensorList.length === 0 ? (
          <Card className="glass"><CardContent className="p-8 text-center text-muted-foreground"><Activity className="mx-auto h-10 w-10 mb-3 opacity-40" /><p>Waiting for sensor data...</p></CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {sensorList.map((sensor) => {
              const Icon = sensorIcons[sensor.sensor_type] ?? sensorIcons.default;
              const isAlert = sensor.status !== "NORMAL";
              return (
                <Card key={sensor.sensor_id} className={"glass " + (isAlert ? "border border-destructive/50" : "border border-white/10")}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={"h-5 w-5 " + (isAlert ? "text-destructive" : "text-primary")} />
                        <span className="text-sm font-medium capitalize">{sensor.sensor_type}</span>
                      </div>
                      <span className={"text-xs px-2 py-0.5 rounded-full font-mono " + (isAlert ? "bg-destructive/20 text-destructive" : "bg-chart-3/20 text-chart-3")}>{sensor.status}</span>
                    </div>
                    <div className="text-2xl font-bold">{sensor.value.toFixed(1)} <span className="text-sm text-muted-foreground">{sensor.unit}</span></div>
                    <div className="text-xs text-muted-foreground mt-1">{sensor.location}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      {activeAlerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" />Recent Alerts</h2>
          <div className="space-y-2">
            {activeAlerts.slice(0, 5).map((alert) => (
              <Card key={alert.id} className="glass border border-destructive/30">
                <CardContent className="p-3 flex items-center justify-between gap-2">
                  <div><p className="text-sm font-medium text-destructive">{alert.message}</p><p className="text-xs text-muted-foreground">{alert.sensor_id}</p></div>
                  <span className="text-xs px-2 py-1 bg-destructive/20 text-destructive rounded font-mono shrink-0">{alert.severity}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
