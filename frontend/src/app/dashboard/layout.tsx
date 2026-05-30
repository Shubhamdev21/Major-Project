"use client";
import { useEffect, useRef } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { useStore } from "@/store/useStore";
import io, { Socket } from "socket.io-client";
import { toast } from "sonner";
import api from "@/lib/api";
import AuthGuard from "@/components/auth/AuthGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { updateSensor, addAlert, setSensors, setAlerts } = useStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const [sensorRes, alertRes] = await Promise.all([
          api.get('/sensors/current'),
          api.get('/alerts')
        ]);
        setSensors(sensorRes.data);
        setAlerts(alertRes.data);
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      }
    };
    fetchInitialData();

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';

    const connectSocket = () => {
      if (socketRef.current?.connected) return;

      const socket = io(socketUrl, {
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 10000,
        timeout: 20000,
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      socket.on('sensor_update', (data) => {
        updateSensor(data);
      });

      socket.on('alert', (alert) => {
        addAlert(alert);
        toast.error(`🚨 ALERT: ${alert.message}`, {
          duration: 5000,
        });
      });
    };

    connectSocket();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [updateSensor, addAlert, setSensors, setAlerts]);

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
          <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
          <Topbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-6 z-10 pb-20">
            {children}
          </main>
          <footer className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 border-t border-white/5 bg-background/50 backdrop-blur-md z-20 flex justify-between items-center text-[9px] sm:text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-4 sm:px-8">
            <div>MAJOR_PROJECT_EVALUATION_v1.0</div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-chart-3 animate-pulse" />
              DEVELOPED BY: <span className="text-foreground font-bold">SHUBHAM</span>
            </div>
          </footer>
        </div>
      </div>
    </AuthGuard>
  );
}
