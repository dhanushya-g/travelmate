import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
}

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if ("Notification" in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast({
        title: "Not supported",
        description: "Push notifications are not supported in this browser.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        toast({
          title: "Notifications enabled",
          description: "You'll now receive trip alerts and updates.",
        });
        return true;
      } else if (result === "denied") {
        toast({
          title: "Notifications blocked",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive",
        });
        return false;
      }
      return false;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }, [isSupported, toast]);

  const sendNotification = useCallback(
    ({ title, body, icon, tag, requireInteraction }: NotificationOptions) => {
      if (!isSupported || permission !== "granted") {
        console.log("Notification not sent - permission not granted");
        return null;
      }

      try {
        const notification = new Notification(title, {
          body,
          icon: icon || "/favicon.ico",
          tag,
          requireInteraction,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        return notification;
      } catch (error) {
        console.error("Error sending notification:", error);
        return null;
      }
    },
    [isSupported, permission]
  );

  const scheduleNotification = useCallback(
    (options: NotificationOptions, delayMs: number) => {
      return setTimeout(() => {
        sendNotification(options);
      }, delayMs);
    },
    [sendNotification]
  );

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
    scheduleNotification,
  };
};
