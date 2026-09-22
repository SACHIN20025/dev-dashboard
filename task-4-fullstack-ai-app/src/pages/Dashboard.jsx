import React, { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { FolderKanban, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { theme } from "../theme";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";
import TaskList from "../components/TaskList";
import PulseGraph from "../components/PulseGraph";
import { StatCard, SkeletonCard } from "../components/Primitives";

export default function Dashboard() {
  const { query = "" } = useOutletContext() || {};
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([api.listProjects(), api.listTasks()])
      .then(([projectsData, tasksData]) => {
        if (cancelled) return;
        setProjects(projectsData);
        setTasks(tasksData);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesQuery =
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        (t.project?.name || "").toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [tasks, query, statusFilter]);

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const inProgressCount = tasks.filter((t) => t.status === "in-progress").length;
  const blockedCount = tasks.filter((t) => t.priority === "high" && t.status !== "done").length;

  // normalize each task's project name for the TaskList / TaskRow display
  const displayTasks = filteredTasks.map((t) => ({
    ...t,
    project: t.project?.name || "Unassigned",
    who: t.assignee?.name ? t.assignee.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "—",
    due: t.dueDate || "No due date",
  }));

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: theme.textPrimary }}>
            Good to see you, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>
            {projects.length} active projects, {inProgressCount} tasks in flight
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg px-3 py-2 text-xs" style={{ background: theme.redSoft, color: theme.red }}>
          Couldn't reach the API: {error}. Is the backend running at the configured VITE_API_BASE_URL?
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Active projects" value={projects.length} icon={FolderKanban} accent={theme.violet} />
            <StatCard label="Tasks done" value={doneCount} icon={CheckCircle2} accent={theme.green} />
            <StatCard label="In progress" value={inProgressCount} icon={Clock} accent={theme.amber} />
            <StatCard label="High priority open" value={blockedCount} icon={AlertCircle} accent={theme.red} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <PulseGraph loading={loading} />
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : projects.length === 0 ? (
            <div className="sm:col-span-2 text-center py-10 text-sm" style={{ color: theme.textMuted }}>
              No projects yet — head to Projects to create your first one.
            </div>
          ) : (
            projects.slice(0, 4).map((p) => (
              <ProjectCard
                key={p.id}
                project={{
                  name: p.name,
                  desc: p.description || "No description yet",
                  tech: [],
                  progress: p.progress ?? 0,
                  tasks: p.taskCount ?? p.tasks?.length ?? 0,
                  due: p.dueDate || "—",
                  status: p.status === "at-risk" ? "at-risk" : "on-track",
                }}
              />
            ))
          )}
        </div>
      </div>

      <TaskList tasks={displayTasks} loading={loading} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
    </>
  );
}
