"use client";
import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingsPage() {
  const [chatId, setChatId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const handleSubscribe = async () => {
    if (!chatId) {
      toast.error("Please enter your Telegram Chat ID!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, name }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("🎉 Subscribed! You'll receive Telegram alerts!");
        setChatId("");
        setName("");
      } else {
        toast.error(data.error || "Failed to subscribe");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight neon-text mb-2">System Settings</h1>
        <p className="text-muted-foreground">Configure your industrial monitoring preferences.</p>
      </div>
      <div className="grid gap-6 max-w-2xl">

        {/* Telegram Subscription Card */}
        <Card className="glass border border-primary/30">
          <CardHeader>
            <CardTitle>📱 Subscribe to Telegram Alerts</CardTitle>
            <CardDescription>
              Get real-time industrial alerts directly on your Telegram!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/10 rounded-lg p-4 text-sm space-y-2">
              <p className="font-semibold text-primary">How to get your Chat ID:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Open Telegram app</li>
                <li>Search for <span className="text-primary font-mono">@userinfobot</span></li>
                <li>Send <span className="text-primary font-mono">/start</span></li>
                <li>Copy the ID number it gives you</li>
              </ol>
            </div>
            <div className="space-y-2">
              <Label>Your Name (optional)</Label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background/50 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label>Telegram Chat ID *</Label>
              <input
                type="text"
                placeholder="e.g. 123456789"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className="w-full bg-background/50 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <Button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full neon-border bg-primary/20 hover:bg-primary/40 text-primary-foreground"
            >
              {loading ? "Subscribing..." : "🔔 Subscribe to Alerts"}
            </Button>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage how you receive alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive real-time alerts in the browser.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Telegram Alerts</Label>
                <p className="text-xs text-muted-foreground">Forward critical alerts to your Telegram bot.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Digest</Label>
                <p className="text-xs text-muted-foreground">Receive daily summary reports via email.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>System Preferences</CardTitle>
            <CardDescription>General monitoring behavior.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Resolve Alerts</Label>
                <p className="text-xs text-muted-foreground">Mark alerts as resolved when sensors return to normal.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Refresh Interval</Label>
                <p className="text-xs text-muted-foreground">Frequency of analytics data polling.</p>
              </div>
              <select className="bg-background/50 border border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary">
                <option>5 Seconds</option>
                <option>10 Seconds</option>
                <option>30 Seconds</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="neon-border bg-primary/20 hover:bg-primary/40 text-primary-foreground">
            SAVE CONFIGURATION
          </Button>
        </div>
      </div>
    </div>
  );
}