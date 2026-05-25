"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Zap, Fan, BellRing, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface Rule {
  id: string;
  condition: string;
  action: string;
  enabled: boolean;
}

export default function AutomationPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [condition, setCondition] = useState("");
  const [action, setAction] = useState("");

  const fetchRules = async () => {
    try {
      const res = await api.get('/automation');
      setRules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/automation', { condition, action });
      toast.success('Rule created');
      setCondition("");
      setAction("");
      fetchRules();
    } catch (err) {
      toast.error('Failed to create rule');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/automation/${id}`);
      toast.success('Rule deleted');
      fetchRules();
    } catch (err) {
      toast.error('Failed to delete rule');
    }
  };

  const controlActuator = async (device: string, cmd: string) => {
    try {
      await api.post(`/actuators/${device}/control`, { command: cmd });
      toast.success(`Sent ${cmd} to ${device}`);
    } catch (err) {
      toast.error(`Failed to control ${device}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight neon-text mb-2">Automation & Controls</h1>
        <p className="text-muted-foreground">Manage factory automation rules and manually override actuators.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rules List */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary neon-text" />
              Active Rules
            </CardTitle>
            <CardDescription>Rules that are currently evaluated in real-time.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {rules.length === 0 ? (
              <p className="text-muted-foreground text-sm">No automation rules configured.</p>
            ) : (
              rules.map(rule => (
                <div key={rule.id} className="flex items-center justify-between p-3 rounded-md bg-white/5 border border-white/10">
                  <div>
                    <div className="font-mono text-sm text-chart-4">IF {rule.condition}</div>
                    <div className="font-mono text-sm text-primary">THEN {rule.action}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch checked={rule.enabled} />
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(rule.id)} className="text-destructive hover:bg-destructive/20">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Add Rule Form */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle>Create New Rule</CardTitle>
            <CardDescription>Format: [sensor_type] [operator] [value]</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddRule} className="space-y-4">
              <div className="space-y-2">
                <Label>Condition</Label>
                <Input 
                  placeholder="e.g. gas > 800" 
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="bg-background/50 font-mono"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Action</Label>
                <Input 
                  placeholder="e.g. TURN_ON_FAN" 
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="bg-background/50 font-mono"
                  required
                />
              </div>
              <Button type="submit" className="w-full neon-border">Create Rule</Button>
            </form>
          </CardContent>
        </Card>

        {/* Manual Overrides */}
        <Card className="glass col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Manual Actuator Overrides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-md bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Fan className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Ventilation Fan</div>
                    <div className="text-xs text-muted-foreground">Emergency Gas Purge</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => controlActuator('fan', 'ON')} className="border-primary/50 text-primary hover:bg-primary/20">ON</Button>
                  <Button size="sm" variant="outline" onClick={() => controlActuator('fan', 'OFF')}>OFF</Button>
                </div>
              </div>

              <div className="p-4 rounded-md bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-destructive/20">
                    <BellRing className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <div className="font-medium">Evacuation Alarm</div>
                    <div className="text-xs text-muted-foreground">Factory Floor Siren</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => controlActuator('alarm', 'ON')} className="border-destructive/50 text-destructive hover:bg-destructive/20">ON</Button>
                  <Button size="sm" variant="outline" onClick={() => controlActuator('alarm', 'OFF')}>OFF</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
