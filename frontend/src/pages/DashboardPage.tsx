import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useDashboard } from "@/hooks/useDashboard";
import { CompletionBanner } from "@/components/profile/CompletionBanner";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";

export function DashboardPage() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { stats, activity, analytics, loading } = useDashboard();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-text">
          Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          {user?.email ?? "Your job search dashboard"}
        </p>
      </div>

      {profile && (
        <div className="mb-6">
          <CompletionBanner hasResume={!!profile.resume_pdf_url} />
        </div>
      )}

      <div className="mb-6">
        <StatsBar stats={stats} />
      </div>

      <div className="mb-6">
        <AnalyticsCharts data={analytics} loading={loading} />
      </div>

      <div className="max-w-md">
        <RecentActivity items={activity} loading={loading} />
      </div>
    </div>
  );
}
