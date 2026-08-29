import React from "react";
import { Menu, Search, Plus, Bell } from "lucide-react";
import { theme } from "../theme";

export default function Topbar({ query, setQuery, onOpenNav }) {
  return (
    <header
      className="flex items-center gap-3 px-4 md:px-6 py-3.5 shrink-0"
      style={{ borderBottom: `1px solid ${theme.border}`, background: theme.bg }}
    >
      <button className="md:hidden" onClick={onOpenNav} aria-label="Open navigation">
        <Menu size={18} style={{ color: theme.textSecondary }} />
      </button>

      <div
        className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg max-w-md"
        style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
      >
        <Search size={14} style={{ color: theme.textMuted }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks or projects..."
          className="bg-transparent outline-none text-sm w-full"
          style={{ color: theme.textPrimary }}
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium"
          style={{ background: theme.violet, color: "#fff" }}
        >
          <Plus size={14} /> New Task
        </button>
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center relative"
          style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
          aria-label="Notifications"
        >
          <Bell size={14} style={{ color: theme.textSecondary }} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: theme.red }} />
        </button>
      </div>
    </header>
  );
}
