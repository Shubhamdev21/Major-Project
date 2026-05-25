"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SensorData } from "@/store/useStore";
import { Activity, Droplets, Thermometer, Wind, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface SensorCardProps {
  sensor: SensorData | undefined;
  title: string;
  type: string;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'temperature': return Thermometer;
    case 'humidity': return Droplets;
    case 'gas': return Wind;
    case 'light': return Lightbulb;
    default: return Activity;
  }
};

export default function SensorCard({ sensor, title, type }: SensorCardProps) {
  const Icon = getIcon(type);
  const isCritical = sensor?.status === 'CRITICAL';
  const isWarning = sensor?.status === 'WARNING';

  return (
    <Card className={cn(
      "glass border-white/10 transition-all duration-500 overflow-hidden relative",
      isCritical ? "border-destructive/50 shadow-[0_0_20px_rgba(var(--destructive),0.2)]" : 
      isWarning ? "border-chart-4/50 shadow-[0_0_20px_rgba(var(--chart-4),0.1)]" : ""
    )}>
      {/* Animated background glow based on status */}
      <div className={cn(
        "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 pointer-events-none transition-colors duration-1000",
        isCritical ? "bg-destructive" : isWarning ? "bg-chart-4" : "bg-primary"
      )} />
      
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <Icon className={cn(
          "h-4 w-4",
          isCritical ? "text-destructive animate-pulse" : 
          isWarning ? "text-chart-4" : "text-primary neon-text"
        )} />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className={cn(
            "text-4xl font-bold tracking-tighter font-mono",
            isCritical ? "text-destructive text-shadow-sm" : 
            isWarning ? "text-chart-4" : "text-foreground"
          )}>
            {sensor ? sensor.value.toFixed(1) : "--"}
          </div>
          <div className="text-sm text-muted-foreground font-mono">
            {sensor ? sensor.unit : ""}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span>{sensor?.location || "Loading..."}</span>
          <span className={cn(
            "px-2 py-0.5 rounded-full border",
            isCritical ? "border-destructive text-destructive bg-destructive/10" : 
            isWarning ? "border-chart-4 text-chart-4 bg-chart-4/10" : 
            "border-primary/30 text-primary bg-primary/10"
          )}>
            {sensor?.status || "WAITING"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
