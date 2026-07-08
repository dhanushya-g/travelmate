import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Clock, 
  AlertTriangle, 
  Users, 
  Sun, 
  CloudRain, 
  Thermometer,
  TrendingUp,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  time: string;
  activity: string;
  duration: string;
}

interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
}

interface RushTimeAlertsProps {
  destination: string;
  days: DayPlan[];
  startDate?: string;
}

interface Alert {
  id: string;
  type: "rush" | "weather" | "closure" | "event";
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  time?: string;
  day?: number;
}

// Mock rush hour data based on typical patterns
const getRushHourAlerts = (days: DayPlan[]): Alert[] => {
  const alerts: Alert[] = [];
  
  days.forEach((day) => {
    day.activities.forEach((activity) => {
      const hour = parseInt(activity.time.split(":")[0]);
      const isPM = activity.time.includes("PM");
      const actualHour = isPM && hour !== 12 ? hour + 12 : hour;
      
      // Morning rush (8-10 AM)
      if (actualHour >= 8 && actualHour <= 10) {
        alerts.push({
          id: `rush-${day.day}-${activity.time}`,
          type: "rush",
          severity: "medium",
          title: "Morning Rush Hour",
          description: `Consider arriving 30 minutes earlier for "${activity.activity}" to avoid crowds.`,
          time: activity.time,
          day: day.day,
        });
      }
      
      // Lunch rush (12-2 PM)
      if (actualHour >= 12 && actualHour <= 14) {
        alerts.push({
          id: `lunch-${day.day}-${activity.time}`,
          type: "rush",
          severity: "low",
          title: "Lunch Hour Crowds",
          description: `"${activity.activity}" may be busier during lunch hours. Book ahead if possible.`,
          time: activity.time,
          day: day.day,
        });
      }
      
      // Evening rush (5-7 PM)
      if (actualHour >= 17 && actualHour <= 19) {
        alerts.push({
          id: `evening-${day.day}-${activity.time}`,
          type: "rush",
          severity: "medium",
          title: "Evening Rush Hour",
          description: `Expect heavy traffic near "${activity.activity}". Allow extra travel time.`,
          time: activity.time,
          day: day.day,
        });
      }
    });
  });
  
  return alerts;
};

// Generate mock weather/event alerts
const getContextualAlerts = (destination: string): Alert[] => {
  return [
    {
      id: "weather-1",
      type: "weather",
      severity: "low",
      title: "Weather Advisory",
      description: `Check local forecast for ${destination} before outdoor activities.`,
    },
    {
      id: "event-1",
      type: "event",
      severity: "low",
      title: "Local Events",
      description: "Check for local festivals or events that may affect crowds and pricing.",
    },
  ];
};

export const RushTimeAlerts = ({ destination, days, startDate }: RushTimeAlertsProps) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const rushAlerts = getRushHourAlerts(days);
    const contextualAlerts = getContextualAlerts(destination);
    setAlerts([...rushAlerts, ...contextualAlerts]);
  }, [days, destination]);

  const handleEnableNotifications = async () => {
    if (!("Notification" in window)) {
      toast({
        variant: "destructive",
        title: "Not supported",
        description: "Push notifications are not supported in this browser.",
      });
      return;
    }

    if (Notification.permission === "granted") {
      setNotificationsEnabled(true);
      toast({
        title: "Notifications enabled",
        description: "You'll receive alerts about rush hours and changes.",
      });
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        toast({
          title: "Notifications enabled",
          description: "You'll receive alerts about rush hours and changes.",
        });
        
        // Show a test notification
        new Notification("TravelMate Alerts Active", {
          body: `We'll notify you about rush hours for your ${destination} trip!`,
          icon: "/favicon.ico",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Notifications blocked",
        description: "Please enable notifications in your browser settings.",
      });
    }
  };

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts((prev) => new Set([...prev, alertId]));
  };

  const visibleAlerts = alerts.filter((a) => !dismissedAlerts.has(a.id));
  const highPriorityAlerts = visibleAlerts.filter((a) => a.severity === "high");
  const mediumPriorityAlerts = visibleAlerts.filter((a) => a.severity === "medium");
  const lowPriorityAlerts = visibleAlerts.filter((a) => a.severity === "low");

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "rush":
        return Users;
      case "weather":
        return CloudRain;
      case "closure":
        return AlertTriangle;
      case "event":
        return TrendingUp;
      default:
        return Bell;
    }
  };

  const getSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-gold/10 text-gold border-gold/20";
      case "low":
        return "bg-ocean/10 text-ocean border-ocean/20";
    }
  };

  return (
    <Card variant="default">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-primary" />
            Smart Timing & Alerts
          </span>
          <div className="flex items-center gap-2">
            <Label htmlFor="notifications" className="text-sm font-normal text-muted-foreground">
              Push Alerts
            </Label>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={(checked) => {
                if (checked) {
                  handleEnableNotifications();
                } else {
                  setNotificationsEnabled(false);
                }
              }}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {visibleAlerts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No alerts at this time</p>
          </div>
        ) : (
          <>
            {highPriorityAlerts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-destructive flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Important
                </h4>
                {highPriorityAlerts.map((alert) => {
                  const Icon = getAlertIcon(alert.type);
                  return (
                    <div
                      key={alert.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border",
                        getSeverityColor(alert.severity)
                      )}
                    >
                      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{alert.title}</span>
                          {alert.day && (
                            <Badge variant="outline" className="text-xs">
                              Day {alert.day}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs opacity-80">{alert.description}</p>
                      </div>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="p-1 hover:bg-background/50 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {mediumPriorityAlerts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gold flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Rush Hour Tips
                </h4>
                {mediumPriorityAlerts.slice(0, 3).map((alert) => {
                  const Icon = getAlertIcon(alert.type);
                  return (
                    <div
                      key={alert.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border",
                        getSeverityColor(alert.severity)
                      )}
                    >
                      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{alert.title}</span>
                          {alert.time && (
                            <Badge variant="outline" className="text-xs">
                              {alert.time}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs opacity-80">{alert.description}</p>
                      </div>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="p-1 hover:bg-background/50 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
                {mediumPriorityAlerts.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{mediumPriorityAlerts.length - 3} more rush hour tips
                  </p>
                )}
              </div>
            )}

            {lowPriorityAlerts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-ocean flex items-center gap-1">
                  <Bell className="w-4 h-4" />
                  Good to Know
                </h4>
                {lowPriorityAlerts.slice(0, 2).map((alert) => {
                  const Icon = getAlertIcon(alert.type);
                  return (
                    <div
                      key={alert.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border",
                        getSeverityColor(alert.severity)
                      )}
                    >
                      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-sm">{alert.title}</span>
                        <p className="text-xs opacity-80 mt-0.5">{alert.description}</p>
                      </div>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="p-1 hover:bg-background/50 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Alerts are based on typical patterns. Check local sources for real-time updates.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
