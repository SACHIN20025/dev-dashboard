import React from "react";
import { GitBranch, X, LayoutDashboard, FolderKanban, CheckSquare, Users, Settings } from "lucide-react";
import { theme } from "../theme";
import { NAV_ITEMS } from "../data";

const ICONS = {
  dashboard: LayoutDashboard,
  projects: FolderKanban,
  tasks: CheckSquare,
  team: Users,
  settings: Settings,
};

export default function Sidebar({ active, setActive, mobileOpen, setMobileOpen }) {
  return (
    <aside
      className={`${mobileOpen ? "flex" : "hidden"} md:flex flex-col w-56 shrink-0 fixed md:static inset-y-0 left-0 z-20 p-4`}
      style={{ background: theme.surface, borderRight: `1px solid ${theme.border}` }}
    >
      <div className="flex items-center justify-between mb-8 px-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: theme.violet }}>
            <GitBranch size={14} color="#fff" />
          </div>
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: theme.textPrimary, fontFamily: "ui-monospace, monospace" }}
          >
            devflow
          </span>
        </div>
        <button className="md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
          <X size={16} style={{ color: theme.textMuted }} />
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.id];
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActive(item.id);
                setMobileOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left"
              style={{
                background: isActive ? theme.violetSoft : "transparent",
                color: isActive ? theme.violet : theme.textSecondary,
              }}
            >
              <Icon size={15} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-4" style={{ borderTop: `1px solid ${theme.borderSoft}` }}>
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg" style={{ background: theme.surfaceRaised }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
            style={{ background: theme.violet, color: "#fff", fontFamily: "ui-monospace, monospace" }}
          >
            SS
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: theme.textPrimary }}>Sachin Singh</p>
            <p className="text-[10px] truncate" style={{ color: theme.textMuted }}>Frontend Engineer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
