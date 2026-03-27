"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface LimitProgressProps {
  current: number;
  limit: number;
  type?: "kWh" | "cost";
  threshold?: number;
}

export function LimitProgress({
  current,
  limit,
  type = "kWh",
  threshold = 80,
}: LimitProgressProps) {
  const percentage = Math.min(100, Math.round((current / limit) * 100));
  const isWarning = percentage >= threshold;
  const isExceeded = percentage >= 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          Monthly {type === "kWh" ? "Usage" : "Budget"} Limit
          {isExceeded ? (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          ) : isWarning ? (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {current.toFixed(1)} / {limit} {type === "kWh" ? "kWh" : "$"}
            </span>
            <span
              className={`font-medium ${
                isExceeded
                  ? "text-destructive"
                  : isWarning
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {percentage}%
            </span>
          </div>
          <Progress
            value={percentage}
            className={`h-2 ${
              isExceeded
                ? "bg-destructive/20"
                : isWarning
                ? "bg-yellow-200"
                : "bg-green-200"
            }`}
          />
          {isExceeded && (
            <p className="text-xs text-destructive mt-2">
              Limit exceeded! Consider reducing usage.
            </p>
          )}
          {isWarning && !isExceeded && (
            <p className="text-xs text-yellow-600 mt-2">
              Approaching limit. Monitor your usage.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
