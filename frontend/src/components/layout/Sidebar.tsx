"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Activity, AlertTriangle, Settings, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import ClientOnly from "@/components/ClientOnly";

const routes = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/analytics", label: "Analytics", icon: Activity },
  { href: "/dashboard/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/dashboard/automation", label: "Automation", icon: Zap },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 glass border-r border-white/10 h-screen flex flex-col pt-4">
      <div className="px-6 mb-8 flex items-center gap-2">
        <ClientOnly>
          <Activity className="h-8 w-8 text-primary neon-text" />
        </ClientOnly>
        <span className="text-lg font-bold tracking-widest text-primary neon-text">MAJOR_IOT</span>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300",
              pathname === route.href
                ? "bg-primary/20 text-primary border border-primary/50 shadow-[inset_0_0_10px_rgba(var(--primary),0.2)]"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <ClientOnly>
              <route.icon className={cn("h-5 w-5", pathname === route.href ? "neon-text" : "")} />
            </ClientOnly>
            <span className="font-medium">{route.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 text-xs text-center text-muted-foreground font-mono">
        SYSTEM STATUS: <span className="text-chart-3 neon-text">ONLINE</span>
      </div>
    </div>
  );
}
