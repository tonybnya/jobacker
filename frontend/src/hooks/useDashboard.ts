import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api-client";
import type { DashboardStats, ActivityItem, AnalyticsData } from "@/types";

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ totalApplications: 0, avgResumeScore: null, interviewsLanded: 0, offersReceived: 0 });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({ applicationsOverTime: [], scoreDistribution: [], pipelineFunnel: [] });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [statsRes, activityRes, analyticsRes] = await Promise.all([
      apiFetch<{ stats: DashboardStats }>("/dashboard/stats"),
      apiFetch<{ activity: ActivityItem[] }>("/dashboard/activity"),
      apiFetch<{ analytics: AnalyticsData }>("/dashboard/analytics"),
    ]);
    if (statsRes.success && statsRes.data) setStats(statsRes.data.stats);
    if (activityRes.success && activityRes.data) setActivity(activityRes.data.activity);
    if (analyticsRes.success && analyticsRes.data) setAnalytics(analyticsRes.data.analytics);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { stats, activity, analytics, loading, refresh };
}
