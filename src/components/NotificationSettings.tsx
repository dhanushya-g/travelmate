import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellOff, Check, X } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export const NotificationSettings = () => {
  const { isSupported, permission, requestPermission, sendNotification } = usePushNotifications();

  const handleTestNotification = () => {
    sendNotification({
      title: "TravelMate Alert",
      body: "This is a test notification. Your trip alerts are working!",
      tag: "test",
    });
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BellOff className="w-5 h-5 text-muted-foreground" />
            Notifications Not Supported
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your browser doesn't support push notifications. Try using a modern browser like Chrome, Firefox, or Edge.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="w-5 h-5 text-primary" />
          Push Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Status</p>
            <p className="text-sm text-muted-foreground">
              {permission === "granted" && (
                <span className="flex items-center gap-1 text-forest">
                  <Check className="w-3 h-3" /> Enabled
                </span>
              )}
              {permission === "denied" && (
                <span className="flex items-center gap-1 text-destructive">
                  <X className="w-3 h-3" /> Blocked
                </span>
              )}
              {permission === "default" && "Not configured"}
            </p>
          </div>

          {permission !== "granted" && (
            <Button
              onClick={requestPermission}
              variant={permission === "denied" ? "outline" : "default"}
              size="sm"
              disabled={permission === "denied"}
            >
              <Bell className="w-4 h-4 mr-2" />
              Enable
            </Button>
          )}
        </div>

        {permission === "granted" && (
          <div className="pt-2 border-t border-border">
            <Button variant="outline" size="sm" onClick={handleTestNotification}>
              Send Test Notification
            </Button>
          </div>
        )}

        {permission === "denied" && (
          <p className="text-xs text-muted-foreground">
            To enable notifications, click the lock icon in your browser's address bar and allow notifications for this site.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
