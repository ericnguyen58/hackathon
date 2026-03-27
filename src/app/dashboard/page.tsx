export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { LimitProgress } from "@/components/dashboard/limit-progress";
import { RecentAlerts } from "@/components/dashboard/recent-alerts";
import { Achievements } from "@/components/dashboard/achievements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDashboardData, getRecentAlerts } from "@/lib/actions/energy-actions";

// Demo user ID - in production this would come from auth session
const DEMO_USER_ID = "user_1";

export default async function DashboardPage() {
  // In production, check for authenticated session
  // const session = await auth();
  // if (!session) redirect("/login");

  const dashboardData = await getDashboardData(DEMO_USER_ID);
  const recentAlerts = await getRecentAlerts(DEMO_USER_ID, 5);

  if (!dashboardData.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Energy Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {dashboardData.user.name}
              </p>
            </div>
            <nav className="flex items-center gap-4">
              <a
                href="/dashboard"
                className="text-sm font-medium text-primary"
              >
                Dashboard
              </a>
              <a
                href="/limits"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Limits
              </a>
              <a
                href="/rewards"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Rewards
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <StatsCards
          monthlyKwh={dashboardData.monthlyUsage.kWh}
          monthlyCost={dashboardData.monthlyUsage.cost}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Usage Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Energy Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="kwh" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="kwh">Usage (kWh)</TabsTrigger>
                    <TabsTrigger value="cost">Cost ($)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="kwh">
                    <UsageChart data={dashboardData.dailyData} type="kWh" />
                  </TabsContent>
                  <TabsContent value="cost">
                    <UsageChart data={dashboardData.dailyData} type="cost" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Limit Progress */}
            <div className="grid gap-4 md:grid-cols-2">
              {dashboardData.currentLimit?.kWhLimit && (
                <LimitProgress
                  current={dashboardData.monthlyUsage.kWh}
                  limit={dashboardData.currentLimit.kWhLimit}
                  type="kWh"
                  threshold={dashboardData.currentLimit.alertThreshold}
                />
              )}
              {dashboardData.currentLimit?.costLimit && (
                <LimitProgress
                  current={dashboardData.monthlyUsage.cost}
                  limit={dashboardData.currentLimit.costLimit}
                  type="cost"
                  threshold={dashboardData.currentLimit.alertThreshold}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RecentAlerts alerts={recentAlerts} />
            <Achievements
              userAchievements={dashboardData.user.achievements}
              totalPoints={dashboardData.user.points}
              streakDays={dashboardData.user.streakDays}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
