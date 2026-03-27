"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertType, AlertSeverity } from "@prisma/client";
import { Bell, Check, AlertTriangle, Info, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentAlertsProps {
  alerts: Alert[];
}

const severityIcons = {
  INFO: Info,
  WARNING: AlertTriangle,
  CRITICAL: XCircle,
};

const severityColors = {
  INFO: "bg-blue-100 text-blue-800",
  WARNING: "bg-yellow-100 text-yellow-800",
  CRITICAL: "bg-red-100 text-red-800",
};

const alertTypeLabels: Record<AlertType, string> = {
  LIMIT_APPROACHING: "Limit",
  LIMIT_EXCEEDED: "Limit",
  USAGE_SPIKE: "Usage",
  DAILY_SUMMARY: "Daily",
  WEEKLY_SUMMARY: "Weekly",
  ACHIEVEMENT_EARNED: "Reward",
};

export function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Recent Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent alerts</p>
        ) : (
          alerts.map((alert) => {
            const Icon = severityIcons[alert.severity];
            return (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  alert.isRead ? "bg-muted/50" : "bg-card"
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    alert.isRead ? "bg-muted" : severityColors[alert.severity]
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {alertTypeLabels[alert.type]}
                    </Badge>
                    {!alert.isRead && (
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm mt-1">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(alert.sentAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
