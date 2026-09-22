import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, X, Sparkles, FileText, AlertCircle, Trash2, ChevronDown } from "lucide-react";
import { theme, STATUS_META, PRIORITY_META } from "../theme";
import { api } from "../api/client";
import { ProgressBar, EmptyState } from "../components/Primitives";

function NewTaskModal({ projectId, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const task = await api.createTask({ title, priority, projectId, dueDate: dueDate || undefined });
      onCreated(task);
    } catch (err) {
      setError(err.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-md rounded-xl p-5" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: theme.textPrimary }}>New task</h2>
          <button onClick={onClose}><X size={16} style={{ color: theme.textMuted }} /></button>
        </div>
        {error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3 text-xs" style={{ background: theme.redSoft, color: theme.red }}>
            <AlertCircle size={13} /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs mb-1 block" style={{ color: theme.textSecondary }}>Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: theme.surfaceRaised, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: theme.textSecondary }}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: theme.surfaceRaised, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: theme.textSecondary }}>Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: theme.surfaceRaised, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
            style={{ background: theme.violet, color: "#fff" }}
          >
            {submitting ? "Adding..." : "Add task"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AiGenerateModal({ projectId, projectDesc, onClose, onTasksAdded }) {
  const [description, setDescription] = useState(projectDesc || "");
  const [suggestions, setSuggestions] = useState(null);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setError("");
    setLoading(true);
    setSuggestions(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/ai/generate-tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("devflow_token")}`,
          },
          body: JSON.stringify({ description, projectId }),
        }
      ).then((r) => r.json());
      if (!res.success) throw new Error(res.message || "AI generation failed");
      setSuggestions(res.data);
      setSource(res.source);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddAll() {
    setAdding(true);
    try {
      const created = await Promise.all(
        suggestions.map((s) => api.createTask({ title: s.title, priority: s.priority || "medium", projectId }))
      );
      onTasksAdded(created);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-lg rounded-xl p-5" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold flex items-center gap-1.5" style={{ color: theme.textPrimary }}>
            <Sparkles size={14} style={{ color: theme.violet }} /> AI-assisted task generation
          </h2>
          <button onClick={onClose}><X size={16} style={{ color: theme.textMuted }} /></button>
        </div>
        <p className="text-xs mb-4" style={{ color: theme.textMuted }}>
          Describe what you're building and let AI propose a starter task list.
        </p>

        {error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3 text-xs" style={{ background: theme.redSoft, color: theme.red }}>
            <AlertCircle size={13} /> {error}
          </div>
        )}

        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Build a notifications system supporting email and push, with rate limiting."
          className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none mb-3"
          style={{ background: theme.surfaceRaised, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
        />

        <button
          onClick={handleGenerate}
          disabled={loading || description.trim().length < 5}
          className="w-full py-2 rounded-lg text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-1.5"
          style={{ background: theme.violet, color: "#fff" }}
        >
          <Sparkles size={14} /> {loading ? "Generating..." : "Generate tasks"}
        </button>

        {suggestions && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: theme.textMuted }}>
                {suggestions.length} suggestions
                {source === "fallback-heuristic" && " (local fallback — set ANTHROPIC_API_KEY on the backend for real AI output)"}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto mb-3">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm"
                  style={{ background: theme.surfaceRaised }}
                >
                  <span style={{ color: theme.textPrimary }}>{s.title}</span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ color: PRIORITY_META[s.priority]?.color || theme.textSecondary, background: (PRIORITY_META[s.priority]?.color || theme.textSecondary) + "1A" }}
                  >
                    {s.priority || "medium"}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddAll}
              disabled={adding}
              className="w-full py-2 rounded-lg text-sm font-medium disabled:opacity-60"
              style={{ background: theme.green, color: "#0d1b14" }}
            >
              {adding ? "Adding..." : `Add all ${suggestions.length} to project`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  function load() {
    setLoading(true);
    api.getProject(id).then(setProject).finally(() => setLoading(false));
  }

  useEffect(load, [id]);

  const tasks = project?.tasks || [];
  const filteredTasks = useMemo(
    () => tasks.filter((t) => statusFilter === "all" || t.status === statusFilter),
    [tasks, statusFilter]
  );
  const done = tasks.filter((t) => t.status === "done").length;
  const progress = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);

  async function handleStatusChange(taskId, status) {
    const updated = await api.updateTaskStatus(taskId, status);
    setProject((prev) => ({ ...prev, tasks: prev.tasks.map((t) => (t.id === taskId ? updated : t)) }));
  }

  async function handleDeleteTask(taskId) {
    if (!confirm("Delete this task?")) return;
    await api.deleteTask(taskId);
    setProject((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== taskId) }));
  }

  async function handleSummarize() {
    setSummaryLoading(true);
    try {
      const res = await api.summarizeProject(id);
      setSummary(res);
    } finally {
      setSummaryLoading(false);
    }
  }

  if (loading) {
    return <p className="text-sm" style={{ color: theme.textMuted }}>Loading project...</p>;
  }
  if (!project) {
    return <p className="text-sm" style={{ color: theme.textMuted }}>Project not found.</p>;
  }

  return (
    <>
      <Link to="/projects" className="flex items-center gap-1.5 text-xs w-fit" style={{ color: theme.textMuted }}>
        <ArrowLeft size={13} /> Back to projects
      </Link>

      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: theme.textPrimary }}>{project.name}</h1>
          <p className="text-xs mt-1 max-w-md" style={{ color: theme.textMuted }}>{project.description || "No description yet."}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium"
            style={{ background: theme.violetSoft, color: theme.violet }}
          >
            <Sparkles size={13} /> Generate with AI
          </button>
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium"
            style={{ background: theme.violet, color: "#fff" }}
          >
            <Plus size={13} /> New Task
          </button>
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs" style={{ color: theme.textMuted }}>Progress</span>
          <span className="text-xs font-medium" style={{ color: theme.textPrimary, fontFamily: "ui-monospace, monospace" }}>
            {progress}% ({done}/{tasks.length} tasks)
          </span>
        </div>
        <ProgressBar value={progress} color={project.status === "at-risk" ? theme.amber : theme.green} />
      </div>

      <div className="rounded-xl p-4" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: theme.textPrimary }}>
            <FileText size={13} style={{ color: theme.violet }} /> AI project summary
          </span>
          <button
            onClick={handleSummarize}
            disabled={summaryLoading}
            className="text-[11px] px-2.5 py-1 rounded-md"
            style={{ background: theme.violetSoft, color: theme.violet }}
          >
            {summaryLoading ? "Summarizing..." : summary ? "Refresh" : "Generate"}
          </button>
        </div>
        {summary ? (
          <>
            <p className="text-xs" style={{ color: theme.textSecondary }}>{summary.data.summary}</p>
            {summary.source === "fallback-heuristic" && (
              <p className="text-[10px] mt-1.5" style={{ color: theme.textMuted }}>
                Local fallback summary — set ANTHROPIC_API_KEY on the backend for AI-generated summaries.
              </p>
            )}
          </>
        ) : (
          <p className="text-xs" style={{ color: theme.textMuted }}>Click Generate to get an AI status summary of this project's tasks.</p>
        )}
      </div>

      <div className="rounded-xl flex flex-col" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
        <div className="flex items-center justify-between px-4 py-3.5 flex-wrap gap-2" style={{ borderBottom: `1px solid ${theme.borderSoft}` }}>
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
              <div className="absolute right-0 mt-1 w-40 rounded-lg overflow-hidden z-10" style={{ background: theme.surfaceRaised, border: `1px solid ${theme.border}` }}>
                {["all", "todo", "in-progress", "done"].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setFilterOpen(false); }}
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
          {filteredTasks.length === 0 ? (
            <EmptyState label="tasks" />
          ) : (
            filteredTasks.map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-3 py-3" style={{ borderBottom: `1px solid ${theme.borderSoft}` }}>
                <select
                  value={t.status}
                  onChange={(e) => handleStatusChange(t.id, e.target.value)}
                  className="text-[11px] px-2 py-1 rounded-md outline-none shrink-0"
                  style={{ background: theme.surfaceRaised, color: STATUS_META[t.status].color, border: `1px solid ${theme.border}` }}
                >
                  <option value="todo">To do</option>
                  <option value="in-progress">In progress</option>
                  <option value="done">Done</option>
                </select>
                <p
                  className="flex-1 text-sm truncate"
                  style={{
                    color: t.status === "done" ? theme.textMuted : theme.textPrimary,
                    textDecoration: t.status === "done" ? "line-through" : "none",
                  }}
                >
                  {t.title}
                </p>
                <span
                  className="hidden sm:inline-block text-[10px] px-2 py-1 rounded-full shrink-0"
                  style={{ color: PRIORITY_META[t.priority].color, background: PRIORITY_META[t.priority].color + "1A" }}
                >
                  {PRIORITY_META[t.priority].label}
                </span>
                <span className="hidden md:block text-[11px] shrink-0 w-20" style={{ color: theme.textMuted }}>
                  {t.dueDate || "No due date"}
                </span>
                <button onClick={() => handleDeleteTask(t.id)} className="shrink-0">
                  <Trash2 size={13} style={{ color: theme.textMuted }} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {showTaskModal && (
        <NewTaskModal
          projectId={id}
          onClose={() => setShowTaskModal(false)}
          onCreated={(task) => {
            setProject((prev) => ({ ...prev, tasks: [task, ...prev.tasks] }));
            setShowTaskModal(false);
          }}
        />
      )}

      {showAiModal && (
        <AiGenerateModal
          projectId={id}
          projectDesc={project.description}
          onClose={() => setShowAiModal(false)}
          onTasksAdded={(newTasks) => {
            setProject((prev) => ({ ...prev, tasks: [...newTasks, ...prev.tasks] }));
            setShowAiModal(false);
          }}
        />
      )}
    </>
  );
}
