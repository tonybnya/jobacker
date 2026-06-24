import { useState, useEffect, useCallback } from "react";
import type { DashboardStats, ActivityItem, AnalyticsData } from "@/types";

const TOKEN_KEY = "insforge_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? (data as T) : null;
  } catch {
    return null;
  }
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({ totalApplications: 0, avgResumeScore: null, interviewsLanded: 0, offersReceived: 0 });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({ applicationsOverTime: [], scoreDistribution: [], pipelineFunnel: [] });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [statsRes, activityRes, analyticsRes] = await Promise.all([
      fetchJson<{ success: boolean; stats: DashboardStats }>("/api/dashboard/stats"),
      fetchJson<{ success: boolean; activity: ActivityItem[] }>("/api/dashboard/activity"),
      fetchJson<{ success: boolean; analytics: AnalyticsData }>("/api/dashboard/analytics"),
    ]);
    if (statsRes?.stats) setStats(statsRes.stats);
    if (activityRes?.activity) setActivity(activityRes.activity);
    if (analyticsRes?.analytics) setAnalytics(analyticsRes.analytics);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { stats, activity, analytics, loading, refresh };
}
