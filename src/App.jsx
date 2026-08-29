import React, { useState, useEffect, useMemo } from "react";
import { FolderKanban, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { theme } from "./theme";
import { fetchDashboardData } from "./data";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ProjectCard from "./components/ProjectCard";
import TaskList from "./components/TaskList";
import PulseGraph from "./components/PulseGraph";
import { StatCard, SkeletonCard } from "./components/Primitives";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    let cancelled = false;
    fetchDashboardData().then(({ projects, tasks }) => {
      if (cancelled) return;
      setProjects(projects);
      setTasks(tasks);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesQuery =
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.project.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [tasks, query, statusFilter]);

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const inProgressCount = tasks.filter((t) => t.status === "in-progress").length;

  return (
    <div className="w-full min-h-screen flex" style={{ background: theme.bg, fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}>
      <Sidebar active={active} setActive={setActive} mobileOpen={mobileNavOpen} setMobileOpen={setMobileNavOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar query={query} setQuery={setQuery} onOpenNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h1 className="text-lg font-semibold" style={{ color: theme.textPrimary }}>Good morning, Sachin</h1>
              <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>
                {projects.length || 4} active projects, {inProgressCount} tasks in flight
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              <>
                <StatCard label="Active projects" value={projects.length} icon={FolderKanban} accent={theme.violet} delta="+1 this week" />
                <StatCard label="Tasks done" value={doneCount} icon={CheckCircle2} accent={theme.green} delta="+3 today" />
                <StatCard label="In progress" value={inProgressCount} icon={Clock} accent={theme.amber} />
                <StatCard label="Blocked" value={1} icon={AlertCircle} accent={theme.red} />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <PulseGraph loading={loading} />
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                : projects.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          </div>

          <TaskList tasks={filteredTasks} loading={loading} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
        </main>
      </div>
    </div>
  );
}
