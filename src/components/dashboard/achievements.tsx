"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Footprints, CalendarCheck, Leaf, Target } from "lucide-react";
import { UserAchievement, Achievement } from "@prisma/client";

type UserAchievementWithAchievement = UserAchievement & {
  achievement: Achievement;
};

interface AchievementsProps {
  userAchievements: UserAchievementWithAchievement[];
  totalPoints: number;
  streakDays: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  trophy: Trophy,
  "calendar-check": CalendarCheck,
  leaf: Leaf,
  footprints: Footprints,
  target: Target,
  star: Star,
};

export function Achievements({
  userAchievements,
  totalPoints,
  streakDays,
}: AchievementsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Achievements & Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-primary/5 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Points</p>
            <p className="text-2xl font-bold text-primary">{totalPoints}</p>
          </div>
          <div className="p-3 bg-green-500/5 rounded-lg">
            <p className="text-sm text-muted-foreground">Day Streak</p>
            <p className="text-2xl font-bold text-green-600">{streakDays}</p>
          </div>
        </div>

        {/* Earned Achievements */}
        <div>
          <h4 className="text-sm font-medium mb-3">Earned ({userAchievements.length})</h4>
          <div className="space-y-2">
            {userAchievements.map((ua) => {
              const Icon = iconMap[ua.achievement.icon] || Star;
              return (
                <div
                  key={ua.id}
                  className="flex items-center gap-3 p-2 rounded-lg border bg-card"
                >
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Icon className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{ua.achievement.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ua.achievement.description}
                    </p>
                  </div>
                  <Badge variant="secondary">+{ua.achievement.points}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Achievement Progress */}
        {streakDays < 7 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Next: Week Warrior</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Keep your streak going!</span>
                <span className="font-medium">{streakDays}/7 days</span>
              </div>
              <Progress value={(streakDays / 7) * 100} className="h-2" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
