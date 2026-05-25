"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight neon-text mb-2">Historical Analytics</h1>
        <p className="text-muted-foreground">Detailed performance analysis and historical trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">99.98%</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Avg. Temp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">24.5°C</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Alert Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">0.2 / hr</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass h-[400px] flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>Analytics reports are being generated...</p>
        </div>
      </Card>
    </div>
  );
}
