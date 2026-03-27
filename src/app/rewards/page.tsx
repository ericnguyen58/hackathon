"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getAllAchievements, getDashboardData } from "@/lib/actions/energy-actions";
import {
  Trophy,
  Footprints,
  CalendarCheck,
  Leaf,
  Target,
  Star,
  Zap,
  Flame,
} from "lucide-react";

const DEMO_USER_ID = "user_1";

const ICON_MAP: Record<string, React.ReactNode> = {
  footprints: <Footprints className="h-6 w-6" />,
  "calendar-check": <CalendarCheck className="h-6 w-6" />,
  trophy: <Trophy className="h-6 w-6" />,
  leaf: <Leaf className="h-6 w-6" />,
  target: <Target className="h-6 w-6" />,
  star: <Star className="h-6 w-6" />,
  zap: <Zap className="h-6 w-6" />,
  flame: <Flame className="h-6 w-6" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  SAVINGS: "bg-green-100 text-green-800",
  STREAK: "bg-orange-100 text-orange-800",
  CONSERVATION: "bg-teal-100 text-teal-800",
  MILESTONE: "bg-blue-100 text-blue-800",
  SPECIAL: "bg-purple-100 text-purple-800",
};

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: string;
}

interface UserAchievement {
  id: string;
  achievement: Achievement;
  earnedAt: Date | string;
  progress: number;
}

export default function RewardsPage() {
  const [all, setAll] = useState<Achievement[]>([]);
  const [earned, setEarned] = useState<UserAchievement[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    async function load() {
      const [{ all: allA, earned: earnedA }, dash] = await Promise.all([
        getAllAchievements(DEMO_USER_ID),
        getDashboardData(DEMO_USER_ID),
      ]);
      setAll(allA);
      setEarned(earnedA as unknown as UserAchievement[]);
      setTotalPoints(dash.user?.points ?? 0);
      setStreakDays(dash.user?.streakDays ?? 0);
    }
    load();
  }, []);

  const earnedIds = new Set(earned.map((e) => e.achievement.id));
  const earnedPoints = earned.reduce((sum, e) => sum + e.achievement.points, 0);
  const nextAchievement = all.find((a) => !earnedIds.has(a.id));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Rewards</h1>
              <p className="text-sm text-muted-foreground">
                Earn achievements by managing your energy smartly
              </p>
            </div>
            <nav className="flex items-center gap-4">
              <a href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary">Dashboard</a>
              <a href="/limits" className="text-sm font-medium text-muted-foreground hover:text-primary">Limits</a>
              <a href="/rewards" className="text-sm font-medium text-primary">Rewards</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-yellow-100 p-3">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalPoints}</p>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-orange-100 p-3">
                  <Flame className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{streakDays}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-3">
                  <Trophy className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {earned.length}/{all.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress toward all achievements */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {earnedPoints} / {all.reduce((s, a) => s + a.points, 0)} pts
              </span>
            </div>
            <Progress
              value={all.length ? (earned.length / all.length) * 100 : 0}
              className="h-3"
            />
            {nextAchievement && (
              <p className="text-xs text-muted-foreground mt-2">
                Next up: <span className="font-medium">{nextAchievement.name}</span> — {nextAchievement.description}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Earned achievements */}
        {earned.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Earned Achievements</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {earned.map((ua) => (
                <Card key={ua.id} className="border-2 border-primary/20 bg-primary/5">
                  <CardContent className="pt-5">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-3 text-primary flex-shrink-0">
                        {ICON_MAP[ua.achievement.icon] ?? <Trophy className="h-6 w-6" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">{ua.achievement.name}</p>
                          <Badge className={CATEGORY_COLORS[ua.achievement.category] ?? ""} variant="outline">
                            {ua.achievement.category.toLowerCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {ua.achievement.description}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs font-medium">{ua.achievement.points} pts</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Locked achievements */}
        {all.filter((a) => !earnedIds.has(a.id)).length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Locked</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {all
                .filter((a) => !earnedIds.has(a.id))
                .map((a) => (
                  <Card key={a.id} className="opacity-60">
                    <CardContent className="pt-5">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-muted p-3 text-muted-foreground flex-shrink-0">
                          {ICON_MAP[a.icon] ?? <Trophy className="h-6 w-6" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm">{a.name}</p>
                            <Badge variant="outline" className={CATEGORY_COLORS[a.category] ?? ""}>
                              {a.category.toLowerCase()}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{a.points} pts</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
