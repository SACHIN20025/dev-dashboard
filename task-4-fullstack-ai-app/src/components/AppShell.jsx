import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { theme } from "../theme";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ query, setQuery }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div
      className="w-full min-h-screen flex"
      style={{ background: theme.bg, fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}
    >
      <Sidebar mobileOpen={mobileNavOpen} setMobileOpen={setMobileNavOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar query={query} setQuery={setQuery} onOpenNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
          <Outlet context={{ query }} />
        </main>
      </div>
    </div>
  );
}
