import React, { useState, useEffect, useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Plus, X, Trash2, AlertCircle } from "lucide-react";
import { theme } from "../theme";
import { api } from "../api/client";
import ProjectCard from "../components/ProjectCard";
import { SkeletonCard, EmptyState } from "../components/Primitives";

function NewProjectModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const project = await api.createProject({ name, description, dueDate: dueDate || undefined });
      onCreated(project);
    } catch (err) {
      setError(err.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-md rounded-xl p-5" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: theme.textPrimary }}>New project</h2>
          <button onClick={onClose}><X size={16} style={{ color: theme.textMuted }} /></button>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3 text-xs" style={{ background: theme.redSoft, color: theme.red }}>
            <AlertCircle size={13} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs mb-1 block" style={{ color: theme.textSecondary }}>Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: theme.surfaceRaised, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
            />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: theme.textSecondary }}>Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{ background: theme.surfaceRaised, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
            />
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
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
            style={{ background: theme.violet, color: "#fff" }}
          >
            {submitting ? "Creating..." : "Create project"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Projects() {
  const { query = "" } = useOutletContext() || {};
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  function load() {
    setLoading(true);
    api
      .listProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const filtered = useMemo(
    () => projects.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [projects, query]
  );

  async function handleDelete(id, e) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this project and all its tasks?")) return;
    await api.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: theme.textPrimary }}>Projects</h1>
          <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>{projects.length} total</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium"
          style={{ background: theme.violet, color: "#fff" }}
        >
          <Plus size={14} /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3">
            <EmptyState label="projects" />
          </div>
        ) : (
          filtered.map((p) => (
            <Link key={p.id} to={`/projects/${p.id}`} className="relative group">
              <ProjectCard
                project={{
                  name: p.name,
                  desc: p.description || "No description yet",
                  tech: [],
                  progress: p.progress ?? 0,
                  tasks: p.taskCount ?? 0,
                  due: p.dueDate || "—",
                  status: p.status === "at-risk" ? "at-risk" : "on-track",
                }}
              />
              <button
                onClick={(e) => handleDelete(p.id, e)}
                className="absolute top-3 right-3 w-6 h-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: theme.redSoft }}
                title="Delete project"
              >
                <Trash2 size={12} style={{ color: theme.red }} />
              </button>
            </Link>
          ))
        )}
      </div>

      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onCreated={(project) => {
            setProjects((prev) => [{ ...project, progress: 0, taskCount: 0 }, ...prev]);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}
