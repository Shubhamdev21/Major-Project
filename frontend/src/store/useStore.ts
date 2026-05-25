import { create } from 'zustand';

export interface SensorData {
  id: string;
  sensor_id: string;
  sensor_type: string;
  value: number;
  unit: string;
  location: string;
  status: string;
  timestamp: string;
}

export interface AlertData {
  id: string;
  sensor_id: string;
  severity: string;
  message: string;
  createdAt: string;
  resolved: boolean;
}

interface AppState {
  sensors: Record<string, SensorData>;
  alerts: AlertData[];
  setSensors: (sensors: SensorData[]) => void;
  updateSensor: (sensor: SensorData) => void;
  setAlerts: (alerts: AlertData[]) => void;
  addAlert: (alert: AlertData) => void;
}

export const useStore = create<AppState>((set) => ({
  sensors: {},
  alerts: [],
  setSensors: (sensors) => set({
    sensors: sensors.reduce((acc, s) => ({ ...acc, [s.sensor_id]: s }), {})
  }),
  updateSensor: (sensor) => set((state) => ({
    sensors: { ...state.sensors, [sensor.sensor_id]: sensor }
  })),
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts].slice(0, 50) }))
}));
