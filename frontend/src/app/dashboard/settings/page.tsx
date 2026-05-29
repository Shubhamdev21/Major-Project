"use client";
import { useState } from "react";
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
        toast.success("Subscribed! You will receive Telegram alerts!");
        setChatId("");
        setName("");
      } else {
        toast.error(data.error || "Failed to subscribe");
      }
    } catch (_err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-24">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight neon-text mb-1 sm:mb-2">System Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your industrial monitoring preferences.</p>
      </div>

      <div className="grid gap-4 sm:gap-6 w-full max-w-2xl">

        {/* Telegram Subscription */}
        <Card className="glass border border-primary/30">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Subscribe to Telegram Alerts</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Get real-time industrial alerts on your Telegram!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
            <div className="bg-primary/10 rounded-lg p-3 sm:p-4 text-sm space-y-2">
              <p className="font-semibold text-primary text-xs sm:text-sm">How to get your Chat ID:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-xs sm:text-sm">
                <li>Open Telegram app</li>
                <li>Search for @userinfobot</li>
                <li>Send /start</li>
                <li>Copy the ID number it gives you</li>
              </ol>
            </div>
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Your Name (optional)</Label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background/50 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Telegram Chat ID</Label>
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
              className="w-full neon-border bg-primary/20 hover:bg-primary/40 text-primary-foreground text-sm"
            >
              {loading ? "Subscribing..." : "Subscribe to Alerts"}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="glass">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Notifications</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Manage how you receive alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5 flex-1 min-w-0">
                <Label className="text-sm">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive real-time alerts in the browser.</p>
              </div>
              <Switch defaultChecked className="flex-shrink-0 mt-0.5" />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5 flex-1 min-w-0">
                <Label className="text-sm">Telegram Alerts</Label>
                <p className="text-xs text-muted-foreground">Forward critical alerts to your Telegram bot.</p>
              </div>
              <Switch defaultChecked className="flex-shrink-0 mt-0.5" />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5 flex-1 min-w-0">
                <Label className="text-sm">Email Digest</Label>
                <p className="text-xs text-muted-foreground">Receive daily summary reports via email.</p>
              </div>
              <Switch className="flex-shrink-0 mt-0.5" />
            </div>
          </CardContent>
        </Card>

        {/* System Preferences */}
        <Card className="glass">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">System Preferences</CardTitle>
            <CardDescription className="text-xs sm:text-sm">General monitoring behavior.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5 flex-1 min-w-0">
                <Label className="text-sm">Auto-Resolve Alerts</Label>
                <p className="text-xs text-muted-foreground">Mark alerts as resolved when sensors return to normal.</p>
              </div>
              <Switch defaultChecked className="flex-shrink-0 mt-0.5" />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5 flex-1 min-w-0">
                <Label className="text-sm">Refresh Interval</Label>
                <p className="text-xs text-muted-foreground">Frequency of analytics data polling.</p>
              </div>
              <select className="flex-shrink-0 bg-background/50 border border-white/10 rounded px-2 py-1 text-xs sm:text-sm focus:outline-none focus:border-primary">
                <option>5 Seconds</option>
                <option>10 Seconds</option>
                <option>30 Seconds</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Save button - always visible */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="w-full sm:w-auto neon-border bg-primary/20 hover:bg-primary/40 text-primary-foreground text-sm px-6"
          >
            SAVE CONFIGURATION
          </Button>
        </div>

      </div>
    </div>
  );
}
