# devflow — AI-Powered Project & Task Management Platform

**Task 4 (capstone) — Innovation Hacks Full Stack Development Internship**

The final full-stack application: the Task 1 dashboard, wired to the real Task 2/3 API, with authentication, full project/task management, and an AI-assisted planning feature.

## Features

- **Authentication** — register, login, logout, JWT stored client-side, protected routes redirect to `/login` when logged out
- **Dashboard** — live stats, project overview, and a task list, all pulled from the real API (no mock data)
- **Project management** — list, create, view details, delete (with confirmation); each card shows live progress computed from its tasks
- **Task management** — create, update status inline, set priority and due dates, delete, plus search (dashboard) and status filtering (dashboard + project detail)
- **AI feature (two capabilities, either satisfies the "at least one" requirement)**
  - **AI-assisted task generation** — describe a project in plain English, get a proposed task list back, and add some or all of it with one click
  - **Task summarization** — generates a short natural-language status update for a project from its current tasks
  - Both work with a real Anthropic API key on the backend, or fall back to a clearly-labeled local heuristic so the feature still demos with zero configuration

## Tech Stack

- React 18 + Vite + Tailwind CSS
- React Router v6 (protected routes via a wrapper component)
- Talks to the `devflow-api` backend (see the separate backend repo/zip) over `fetch`

## Project Structure

```
src/
├── App.jsx                     # Routes: /login, /register, and a protected shell
├── api/client.js                # fetch wrapper — attaches JWT, normalizes errors
├── context/AuthContext.jsx      # login/register/logout + current user
├── pages/
│   ├── Login.jsx / Register.jsx
│   ├── Dashboard.jsx             # live stats + task list, pulled from the API
│   ├── Projects.jsx              # project grid + "New Project" modal
│   └── ProjectDetail.jsx         # task board, AI generate modal, AI summary card
├── components/
│   ├── AppShell.jsx               # Sidebar + Topbar + <Outlet/>
│   ├── ProtectedRoute.jsx         # redirects to /login if not authenticated
│   ├── Sidebar.jsx / Topbar.jsx
│   ├── ProjectCard.jsx / TaskList.jsx / PulseGraph.jsx / Primitives.jsx
├── theme.js                       # shared color tokens + status/priority metadata
└── data.js                        # only used now for the decorative commit-pulse heatmap
```

## Running Locally

This app needs the backend running first.

```bash
# 1. Start the backend (see devflow-api's own README)
cd ../devflow-api
npm install
cp .env.example .env   # set JWT_SECRET at minimum
npm run seed             # optional: creates a demo user + sample data
npm run dev

# 2. In a separate terminal, start this frontend
cd devflow-fullstack-app
npm install
cp .env.example .env    # point VITE_API_BASE_URL at the backend above
npm run dev
```

Open `http://localhost:5173`. If you ran `npm run seed` on the backend, log in with:

```
email:    riya@devflow.io
password: password123
```

Otherwise, click **Register** to create a fresh account.

## Enabling Real AI Output

Without any setup, the AI features work using a local fallback so the app is fully demoable. To get real Claude-generated task suggestions and summaries, add a key to the **backend's** `.env`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

No frontend changes needed — the UI already shows which mode produced a given result (look for the "local fallback" note under AI output).

## Build for Production

```bash
npm run build
npm run preview
```

Update `VITE_API_BASE_URL` to your deployed backend's URL before building for a real deployment.

## Notes for Evaluation

- Auth state is checked on load via `GET /api/auth/me`; an invalid/expired token is cleared automatically and the user is sent to `/login`.
- All CRUD actions (create/delete project, create/update/delete task) call the real API and update local state from the server's response — no optimistic-only state that could drift from the database.
- The AI generate-tasks flow lets you review suggestions before committing them, rather than silently writing to the database.
