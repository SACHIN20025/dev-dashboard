import React from "react";
import { Search, ArrowUpRight } from "lucide-react";
import { theme } from "../theme";

export function StatCard({ label, value, delta, icon: Icon, accent }) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs uppercase tracking-wider"
          style={{ color: theme.textMuted, fontFamily: "ui-monospace, monospace" }}
        >
          {label}
        </span>
        <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: accent + "20" }}>
          <Icon size={14} style={{ color: accent }} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span
          className="text-2xl font-semibold"
          style={{ color: theme.textPrimary, fontFamily: "ui-monospace, monospace" }}
        >
          {value}
        </span>
        {delta && (
          <span className="text-xs flex items-center gap-0.5" style={{ color: theme.green }}>
            <ArrowUpRight size={12} /> {delta}
          </span>
        )}
      </div>
    </div>
  );
}

export function ProgressBar({ value, color }) {
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: theme.borderSoft }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl p-4 animate-pulse" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
      <div className="h-3 w-2/3 rounded mb-3" style={{ background: theme.borderSoft }} />
      <div className="h-2 w-full rounded mb-2" style={{ background: theme.borderSoft }} />
      <div className="h-2 w-4/5 rounded mb-4" style={{ background: theme.borderSoft }} />
      <div className="h-1.5 w-full rounded" style={{ background: theme.borderSoft }} />
    </div>
  );
}

export function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-2 text-center">
      <div className="w-11 h-11 rounded-full flex items-center justify-center mb-1" style={{ background: theme.surfaceRaised }}>
        <Search size={18} style={{ color: theme.textMuted }} />
      </div>
      <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>
        No {label} match your filters
      </p>
      <p className="text-xs" style={{ color: theme.textMuted }}>
        Try a different search term or clear the status filter.
      </p>
    </div>
  );
}
