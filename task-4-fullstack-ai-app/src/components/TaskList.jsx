import React, { useState } from "react";
import { GitBranch, ChevronDown } from "lucide-react";
import { theme, STATUS_META, PRIORITY_META } from "../theme";
import { EmptyState } from "./Primitives";

function TaskRow({ task }) {
  const sm = STATUS_META[task.status];
  const pm = PRIORITY_META[task.priority];
  return (
    <div
      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/[0.02] transition-colors"
      style={{ borderBottom: `1px solid ${theme.borderSoft}` }}
    >
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: sm.dot }} />
      <div className="flex-1 min-w-0">
        <p
          className="text-sm truncate"
          style={{
            color: task.status === "done" ? theme.textMuted : theme.textPrimary,
            textDecoration: task.status === "done" ? "line-through" : "none",
          }}
        >
          {task.title}
        </p>
        <p className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: theme.textMuted }}>
          <GitBranch size={10} /> {task.project}
        </p>
      </div>
      <span
        className="hidden sm:inline-block text-[10px] px-2 py-1 rounded-full shrink-0"
        style={{ color: pm.color, background: pm.color + "1A", fontFamily: "ui-monospace, monospace" }}
      >
        {pm.label}
      </span>
      <span className="hidden md:block text-[11px] shrink-0 w-16" style={{ color: theme.textMuted }}>
        {task.due}
      </span>
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0"
        style={{ background: theme.violetSoft, color: theme.violet, fontFamily: "ui-monospace, monospace" }}
        title={task.who}
      >
        {task.who}
      </div>
    </div>
  );
}

export default function TaskList({ tasks, loading, statusFilter, setStatusFilter }) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="rounded-xl flex flex-col" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
      <div
        className="flex items-center justify-between px-4 py-3.5 flex-wrap gap-2"
        style={{ borderBottom: `1px solid ${theme.borderSoft}` }}
      >
        <span className="text-sm font-semibold" style={{ color: theme.textPrimary }}>Tasks</span>
        <div className="relative">
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
            style={{ background: theme.surfaceRaised, color: theme.textSecondary, border: `1px solid ${theme.border}` }}
          >
            {statusFilter === "all" ? "All statuses" : STATUS_META[statusFilter].label}
            <ChevronDown size={12} />
          </button>
          {filterOpen && (
            <div
              className="absolute right-0 mt-1 w-40 rounded-lg overflow-hidden z-10"
              style={{ background: theme.surfaceRaised, border: `1px solid ${theme.border}` }}
            >
              {["all", "todo", "in-progress", "done"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    setFilterOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-white/[0.03]"
                  style={{ color: s === statusFilter ? theme.violet : theme.textSecondary }}
                >
                  {s === "all" ? "All statuses" : STATUS_META[s].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-2 py-1">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 my-2 rounded animate-pulse" style={{ background: theme.borderSoft }} />
          ))
        ) : tasks.length === 0 ? (
          <EmptyState label="tasks" />
        ) : (
          tasks.map((t) => <TaskRow key={t.id} task={t} />)
        )}
      </div>
    </div>
  );
}
