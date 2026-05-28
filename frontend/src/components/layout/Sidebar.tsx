"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Activity, AlertTriangle, Settings, Zap, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ClientOnly from "@/components/ClientOnly";
import { useState } from "react";

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
    <nav className="flex-1 px-4 space-y-2">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300",
            pathname === route.href
              ? "bg-primary/20 text-primary border border-primary/50"
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
  );

  return (
    <>
      {/* Mobile hamburger button - inside topbar area */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 rounded-md bg-background/90 border border-white/10 backdrop-blur-md"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-primary" />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={cn(
        "lg:hidden fixed top-0 left-0 z-[80] h-full w-72 bg-background border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-6 py-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <ClientOnly>
              <Activity className="h-7 w-7 text-primary neon-text" />
            </ClientOnly>
            <span className="text-base font-bold tracking-widest text-primary neon-text">MAJOR_IOT</span>
          </div>
          <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-white/10">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <div className="flex-1 py-4 overflow-y-auto">
          <NavLinks />
        </div>
        <div className="p-4 border-t border-white/10 text-xs text-center text-muted-foreground font-mono">
          SYSTEM STATUS: <span className="text-green-400">ONLINE</span>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 glass border-r border-white/10 h-screen flex-col">
        <div className="px-6 mb-8 flex items-center gap-2 pt-6">
          <ClientOnly>
            <Activity className="h-8 w-8 text-primary neon-text" />
          </ClientOnly>
          <span className="text-lg font-bold tracking-widest text-primary neon-text">MAJOR_IOT</span>
        </div>
        <NavLinks />
        <div className="p-4 border-t border-white/10 text-xs text-center text-muted-foreground font-mono">
          SYSTEM STATUS: <span className="text-green-400 neon-text">ONLINE</span>
        </div>
      </div>
    </>
  );
}
