import Link from "next/link";
import { Activity, Shield, Zap, BarChart3, ArrowRight } from "lucide-react";
import ClientOnly from "@/components/ClientOnly";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="container mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <ClientOnly>
            <Activity className="h-8 w-8 text-primary neon-text" />
          </ClientOnly>
          <span className="text-xl font-bold tracking-widest text-primary neon-text">MAJOR_IOT</span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Login
          </Link>
          <Link href="/register" className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(var(--primary),0.3)]">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col relative z-10">
        <section className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-primary mb-6 animate-fade-in">
            <ClientOnly>
              <Zap className="h-3 w-3" />
            </ClientOnly> 
            SYSTEM STATUS: OPERATIONAL
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 max-w-4xl leading-[1.1]">
            Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-chart-4">Major Project</span> Monitoring Hub
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Real-time telemetry, predictive analytics, and automated response systems for the modern factory floor. Monitor environment health with zero latency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/dashboard" 
              className="group px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all shadow-[0_0_25px_rgba(var(--primary),0.2)]"
            >
              Enter Dashboard
              <ClientOnly>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </ClientOnly>
            </Link>
            <Link 
              href="/register" 
              className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 font-semibold hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              Create Account
            </Link>
          </div>

          {/* Feature Grid Mini */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full max-w-5xl">
            <div className="p-8 rounded-2xl border border-white/5 bg-white/5 text-left group hover:border-primary/20 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <ClientOnly>
                  <Zap className="h-6 w-6" />
                </ClientOnly>
              </div>
              <h3 className="text-xl font-bold mb-3">Ultra-Low Latency</h3>
              <p className="text-muted-foreground">High-performance WebSocket architecture ensuring sensor data sync in under 50ms.</p>
            </div>
            <div className="p-8 rounded-2xl border border-white/5 bg-white/5 text-left group hover:border-primary/20 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center mb-6 text-chart-4">
                <ClientOnly>
                  <BarChart3 className="h-6 w-6" />
                </ClientOnly>
              </div>
              <h3 className="text-xl font-bold mb-3">Predictive Trends</h3>
              <p className="text-muted-foreground">Built-in analytics engine that predicts environmental hazards before they occur.</p>
            </div>
            <div className="p-8 rounded-2xl border border-white/5 bg-white/5 text-left group hover:border-primary/20 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-6 text-chart-3">
                <ClientOnly>
                  <Shield className="h-6 w-6" />
                </ClientOnly>
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Automation</h3>
              <p className="text-muted-foreground">Define custom rules to trigger hardware actuators instantly when thresholds are met.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-white/5 text-center relative z-10">
        <p className="text-sm text-muted-foreground font-mono">
          &copy; 2026 MAJOR PROJECT IOT SYSTEM. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
