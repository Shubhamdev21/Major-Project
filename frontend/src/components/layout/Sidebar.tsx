"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Activity, AlertTriangle, Settings, Zap, Menu, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);

  const NavLinks = () => (
    <>
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
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300",
              pathname === route.href || (route.href === "/dashboard" && pathname === "/dashboard")
                ? "bg-primary/20 text-primary border border-primary/50 shadow-[inset_0_0_10px_rgba(var(--primary),0.2)]"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <ClientOnly>
              <route.icon className={cn("h-5 w-5", pathname === route.href || (route.href === "/dashboard" && pathname === "/dashboard") ? "neon-text" : "")} />
            </ClientOnly>
            <span className="font-medium">{route.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 text-xs text-center text-muted-foreground font-mono">
        SYSTEM STATUS: <span className="text-chart-3 neon-text">ONLINE</span>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-md bg-background/80 border border-white/10 backdrop-blur-md"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <ClientOnly>
          {open ? <X className="h-5 w-5 text-primary" /> : <Menu className="h-5 w-5 text-primary" />}
        </ClientOnly>
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={cn(
        "md:hidden fixed top-0 left-0 h-screen w-64 z-40 glass border-r border-white/10 flex flex-col pt-4 transition-transform duration-300",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <NavLinks />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 glass border-r border-white/10 h-screen flex-col pt-4">
        <NavLinks />
      </div>
    </>
  );
}

