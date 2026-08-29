// Mock data + a fake async "fetch" so the dashboard exercises real
// loading / empty / error UI states. Swap fetchDashboardData() for a real
// API call (e.g. to the Task 2 REST API) when wiring this up to a backend.

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "projects", label: "Projects" },
  { id: "tasks", label: "Tasks" },
  { id: "team", label: "Team" },
  { id: "settings", label: "Settings" },
];

export const PROJECTS_SEED = [
  { id: "p1", name: "Orbit Billing API", desc: "Usage-based billing engine + webhooks", progress: 78, tech: ["Node", "Postgres"], due: "Sep 12", tasks: 14, status: "on-track" },
  { id: "p2", name: "Northstar Dashboard", desc: "Internal analytics for growth team", progress: 42, tech: ["React", "D3"], due: "Sep 20", tasks: 9, status: "at-risk" },
  { id: "p3", name: "Auth Revamp", desc: "Migrate to passkeys + session rotation", progress: 95, tech: ["Next.js", "Redis"], due: "Sep 3", tasks: 6, status: "on-track" },
  { id: "p4", name: "Mobile Sync Engine", desc: "Offline-first sync for field app", progress: 18, tech: ["Swift", "gRPC"], due: "Oct 8", tasks: 21, status: "at-risk" },
];

export const TASKS_SEED = [
  { id: "t1", title: "Fix race condition in webhook retry queue", project: "Orbit Billing API", status: "in-progress", priority: "high", who: "RK", due: "Today" },
  { id: "t2", title: "Write integration tests for invoice generator", project: "Orbit Billing API", status: "todo", priority: "medium", who: "MS", due: "Tomorrow" },
  { id: "t3", title: "Ship passkey enrollment flow", project: "Auth Revamp", status: "done", priority: "high", who: "RK", due: "Aug 27" },
  { id: "t4", title: "Design empty states for cohort charts", project: "Northstar Dashboard", status: "todo", priority: "low", who: "AJ", due: "Sep 4" },
  { id: "t5", title: "Refactor session rotation middleware", project: "Auth Revamp", status: "in-progress", priority: "medium", who: "TL", due: "Sep 1" },
  { id: "t6", title: "Prototype conflict resolution for offline edits", project: "Mobile Sync Engine", status: "todo", priority: "high", who: "MS", due: "Sep 6" },
  { id: "t7", title: "Add retry backoff to sync client", project: "Mobile Sync Engine", status: "in-progress", priority: "medium", who: "AJ", due: "Sep 9" },
  { id: "t8", title: "Review Q3 usage-metering accuracy", project: "Orbit Billing API", status: "done", priority: "medium", who: "TL", due: "Aug 25" },
  { id: "t9", title: "Set up D3 zoom interactions on funnel view", project: "Northstar Dashboard", status: "todo", priority: "medium", who: "RK", due: "Sep 11" },
  { id: "t10", title: "Rotate stale API keys for staging", project: "Auth Revamp", status: "done", priority: "low", who: "MS", due: "Aug 22" },
];

// Deterministic pseudo-activity for the "commit pulse" heatmap (7 rows x 4 weeks)
export const PULSE = [1, 3, 2, 0, 4, 2, 1, 2, 2, 4, 1, 0, 3, 4, 0, 1, 2, 3, 4, 2, 1, 3, 4, 1, 2, 0, 1, 2];

export function fetchDashboardData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ projects: PROJECTS_SEED, tasks: TASKS_SEED });
    }, 900);
  });
}
