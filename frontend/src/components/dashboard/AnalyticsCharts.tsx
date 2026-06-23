import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import type { AnalyticsData } from "@/types";

interface AnalyticsChartsProps {
  data: AnalyticsData;
  loading: boolean;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-lg">
      <p className="text-[10px] text-text-muted">{label}</p>
      <p className="font-mono text-xs text-text">{payload[0].value}</p>
    </div>
  );
}

export function AnalyticsCharts({ data, loading }: AnalyticsChartsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="h-5 w-5 animate-spin text-text-muted" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  const isEmpty = data.applicationsOverTime.length === 0 && data.scoreDistribution.length === 0 && data.pipelineFunnel.length === 0;

  if (isEmpty) {
    return (
      <div className="glass rounded-xl border border-border p-5">
        <h3 className="mb-1 text-xs font-medium text-text">Analytics</h3>
        <p className="pt-8 text-center text-[11px] text-text-muted">
          No data yet. Charts will appear once you have applications and scores.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="glass rounded-xl border border-border p-5">
        <h3 className="mb-4 text-xs font-medium text-text">Applications Over Time</h3>
        {data.applicationsOverTime.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.applicationsOverTime}>
              <defs>
                <linearGradient id="appGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-amber)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-amber)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: "var(--color-text-dim)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "var(--color-text-dim)" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke="var(--color-amber)" fill="url(#appGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-12 text-center text-[11px] text-text-muted">No data yet</p>
        )}
      </div>

      <div className="glass rounded-xl border border-border p-5">
        <h3 className="mb-4 text-xs font-medium text-text">Score Distribution</h3>
        {data.scoreDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="range" tick={{ fontSize: 9, fill: "var(--color-text-dim)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "var(--color-text-dim)" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="var(--color-amber)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-12 text-center text-[11px] text-text-muted">No data yet</p>
        )}
      </div>

      <div className="glass col-span-2 rounded-xl border border-border p-5">
        <h3 className="mb-4 text-xs font-medium text-text">Pipeline Funnel</h3>
        {data.pipelineFunnel.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.pipelineFunnel} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" tick={{ fontSize: 9, fill: "var(--color-text-dim)" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis dataKey="status" type="category" tick={{ fontSize: 9, fill: "var(--color-text-dim)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="var(--color-amber)" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-12 text-center text-[11px] text-text-muted">No data yet</p>
        )}
      </div>
    </div>
  );
}
