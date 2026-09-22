import React from "react";
import { NavLink } from "react-router-dom";
import { GitBranch, X, LayoutDashboard, FolderKanban, LogOut } from "lucide-react";
import { theme } from "../theme";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/projects", label: "Projects", icon: FolderKanban, end: false },
];

function initials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();

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
        {NAV_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left"
              style={({ isActive }) => ({
                background: isActive ? theme.violetSoft : "transparent",
                color: isActive ? theme.violet : theme.textSecondary,
              })}
            >
              <Icon size={15} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 flex flex-col gap-2" style={{ borderTop: `1px solid ${theme.borderSoft}` }}>
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg" style={{ background: theme.surfaceRaised }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
            style={{ background: theme.violet, color: "#fff", fontFamily: "ui-monospace, monospace" }}
          >
            {initials(user?.name || "?")}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: theme.textPrimary }}>{user?.name || "Guest"}</p>
            <p className="text-[10px] truncate" style={{ color: theme.textMuted }}>{user?.email || ""}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs"
          style={{ color: theme.textSecondary }}
        >
          <LogOut size={13} /> Log out
        </button>
      </div>
    </aside>
  );
}
