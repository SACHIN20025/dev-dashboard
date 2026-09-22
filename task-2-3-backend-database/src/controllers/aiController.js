const { Task, Project } = require("../models");
const { ApiError } = require("../middleware/errorHandler");

// -----------------------------------------------------------------------
// TASK 4 — AI feature: AI-assisted task generation + task summarization.
// -----------------------------------------------------------------------
// Uses Google's Gemini API (genuinely free tier — get a key at
// https://aistudio.google.com/app/apikey, no card required) when
// GEMINI_API_KEY is set. If it's not set, or the call fails for any
// reason (bad key, rate limit, network issue), both endpoints fall back
// to a clearly-labeled local heuristic so the feature — and the UI that
// consumes it — still works end-to-end in a demo either way.
// -----------------------------------------------------------------------

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Gemini API responded ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
  if (!text) throw new Error("Gemini API returned an empty response");
  return text;
}

function fallbackTasksFromDescription(description) {
  const chunks = description
    .split(/[.;\n]/)
    .map((c) => c.trim())
    .filter((c) => c.length > 4)
    .slice(0, 5);

  if (chunks.length === 0) {
    return [
      { title: "Define project scope and success criteria", priority: "high" },
      { title: "Set up repository and base project structure", priority: "medium" },
      { title: "Draft initial task backlog", priority: "medium" },
    ];
  }
  return chunks.map((c, i) => ({
    title: c[0].toUpperCase() + c.slice(1),
    priority: i === 0 ? "high" : "medium",
  }));
}

async function generateTasks(req, res, next) {
  try {
    const { projectId, description } = req.body;
    if (!description || description.trim().length < 5) {
      throw new ApiError(400, "description is required (min 5 characters)");
    }

    if (projectId) {
      const project = await Project.findByPk(projectId);
      if (!project) throw new ApiError(404, "Project not found");
    }

    let suggestions;
    let source = "fallback-heuristic";

    try {
      const text = await callGemini(
        `You are a project-planning assistant. Given this project description, propose 4-6 concrete engineering tasks. Respond ONLY with a JSON array like [{"title": "...", "priority": "low|medium|high"}]. No prose, no markdown fences.\n\nProject description: ${description}`
      );
      if (text) {
        suggestions = JSON.parse(text.replace(/```json|```/g, "").trim());
        source = "gemini-api";
      }
    } catch (aiErr) {
      console.warn("AI generate-tasks fell back to heuristic:", aiErr.message);
    }
    if (!suggestions) {
      suggestions = fallbackTasksFromDescription(description);
    }

    res.json({ success: true, source, data: suggestions });
  } catch (err) {
    next(err);
  }
}

async function summarizeProjectTasks(req, res, next) {
  try {
    const { projectId } = req.params;
    const project = await Project.findByPk(projectId, { include: ["tasks"] });
    if (!project) throw new ApiError(404, "Project not found");

    const tasks = project.tasks || [];
    let summary;
    let source = "fallback-heuristic";

    try {
      const taskList = tasks.map((t) => `- [${t.status}] ${t.title} (priority: ${t.priority})`).join("\n");
      const text = await callGemini(
        `Summarize the current state of this project in 2-3 short sentences for a status update, based on its task list. Be specific about progress and risk.\n\nProject: ${project.name}\nTasks:\n${taskList || "(no tasks yet)"}`
      );
      if (text) {
        summary = text;
        source = "gemini-api";
      }
    } catch (aiErr) {
      console.warn("AI summary fell back to heuristic:", aiErr.message);
    }
    if (!summary) {
      const done = tasks.filter((t) => t.status === "done").length;
      const total = tasks.length;
      summary =
        total === 0
          ? `${project.name} has no tasks yet — add some to get started.`
          : `${project.name} is ${Math.round((done / total) * 100)}% complete (${done}/${total} tasks done). ${
              tasks.some((t) => t.priority === "high" && t.status !== "done")
                ? "There are unfinished high-priority tasks that need attention."
                : "No outstanding high-priority blockers."
            }`;
    }

    res.json({ success: true, source, data: { summary } });
  } catch (err) {
    next(err);
  }
}

module.exports = { generateTasks, summarizeProjectTasks };