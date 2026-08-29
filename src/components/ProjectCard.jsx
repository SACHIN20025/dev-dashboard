import React from "react";
import { CheckSquare, Clock } from "lucide-react";
import { theme } from "../theme";
import { ProgressBar } from "./Primitives";

export default function ProjectCard({ project }) {
  const atRisk = project.status === "at-risk";
  const accent = atRisk ? theme.amber : theme.green;

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform duration-200"
      style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{project.name}</h3>
          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>{project.desc}</p>
        </div>
        <span
          className="text-[10px] px-2 py-1 rounded-full whitespace-nowrap shrink-0"
          style={{
            background: atRisk ? theme.amberSoft : theme.greenSoft,
            color: accent,
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {atRisk ? "AT RISK" : "ON TRACK"}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="text-[10px] px-2 py-0.5 rounded"
            style={{ background: theme.violetSoft, color: theme.violet, fontFamily: "ui-monospace, monospace" }}
          >
            {t}
          </span>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px]" style={{ color: theme.textMuted }}>Progress</span>
          <span className="text-[11px] font-medium" style={{ color: theme.textPrimary, fontFamily: "ui-monospace, monospace" }}>
            {project.progress}%
          </span>
        </div>
        <ProgressBar value={project.progress} color={accent} />
      </div>

      <div className="flex items-center justify-between pt-1 text-[11px]" style={{ color: theme.textMuted }}>
        <span className="flex items-center gap-1"><CheckSquare size={12} /> {project.tasks} tasks</span>
        <span className="flex items-center gap-1"><Clock size={12} /> due {project.due}</span>
      </div>
    </div>
  );
}
