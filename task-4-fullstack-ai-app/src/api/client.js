// Thin fetch wrapper around the devflow-api backend (Tasks 2 & 3).
// Reads the base URL from an env var so this points at localhost in dev
// and at your deployed API in production, with no code changes.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("devflow_token");
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // 204 No Content has no body to parse
  if (res.status === 204) return null;

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = json.message || `Request failed with status ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.errors = json.errors;
    throw err;
  }

  return json.data ?? json;
}

export const api = {
  // Auth
  register: (body) => request("/auth/register", { method: "POST", body, auth: false }),
  login: (body) => request("/auth/login", { method: "POST", body, auth: false }),
  me: () => request("/auth/me"),

  // Projects
  listProjects: (params = "") => request(`/projects${params}`),
  getProject: (id) => request(`/projects/${id}`),
  createProject: (body) => request("/projects", { method: "POST", body }),
  updateProject: (id, body) => request(`/projects/${id}`, { method: "PATCH", body }),
  deleteProject: (id) => request(`/projects/${id}`, { method: "DELETE" }),

  // Tasks
  listTasks: (params = "") => request(`/tasks${params}`),
  createTask: (body) => request("/tasks", { method: "POST", body }),
  updateTask: (id, body) => request(`/tasks/${id}`, { method: "PATCH", body }),
  updateTaskStatus: (id, status) => request(`/tasks/${id}/status`, { method: "PATCH", body: { status } }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),

  // AI
  generateTasks: (body) => request("/ai/generate-tasks", { method: "POST", body }),
  summarizeProject: (projectId) => request(`/ai/projects/${projectId}/summary`),
};

export { getToken };
