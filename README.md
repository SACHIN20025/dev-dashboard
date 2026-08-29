# devflow — Developer Productivity Dashboard

**Task 1 — Innovation Hacks Full Stack Development Internship**

A responsive developer productivity dashboard built with React + Vite + Tailwind CSS. Tracks projects, tasks, and daily completion activity in one clean, reusable component system.

## Features

- **Dashboard home view** with greeting, live stats, and an activity summary
- **Collapsible sidebar navigation** (Dashboard / Projects / Tasks / Team / Settings) with an accessible mobile menu
- **User / profile section** in the sidebar footer
- **Project cards** with tech tags, due dates, task counts, and an on-track / at-risk status chip
- **Progress indicators** — animated progress bars on every project card
- **"Commit pulse" activity heatmap** — a GitHub-contribution-style graph of daily task completions (the dashboard's signature visual)
- **Search** across tasks and projects, plus a **status filter** dropdown (all / to do / in progress / done)
- **Loading skeleton states** on every dynamic panel (stats, projects, pulse graph, task list)
- **Empty state** shown when a search/filter combination returns no tasks
- **Fully responsive** — sidebar collapses to a slide-out drawer on mobile, task rows adapt column-by-column down to small screens

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- [lucide-react](https://lucide.dev/) for icons

## Project Structure

```
src/
├── App.jsx                 # Page composition, data fetching, filtering logic
├── theme.js                 # Color tokens + status/priority metadata
├── data.js                  # Mock data + fake async fetch (swap for a real API)
├── index.css                 # Tailwind entry
├── main.jsx                  # React root
└── components/
    ├── Sidebar.jsx           # Nav + profile section
    ├── Topbar.jsx             # Search bar, new task button, notifications
    ├── ProjectCard.jsx        # Project card with progress + tech tags
    ├── TaskList.jsx           # Filterable task list + task row
    ├── PulseGraph.jsx         # Commit-pulse activity heatmap
    └── Primitives.jsx         # StatCard, ProgressBar, SkeletonCard, EmptyState
```

## Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd devflow-productivity-dashboard

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Build for production

```bash
npm run build
npm run preview
```

## Environment Variables

This task ships with mock data (`src/data.js`), so no environment variables are required out of the box. When this dashboard is wired up to the Task 2/3 backend, copy `.env.example` to `.env` and point `VITE_API_BASE_URL` at your running API:

```bash
cp .env.example .env
```

## Screenshots

> Add screenshots of the dashboard (desktop + mobile) here before submitting, e.g.:
> `docs/screenshot-desktop.png`, `docs/screenshot-mobile.png`

## Demo

> Add your demo video link here before submitting.

## Notes for Evaluation

Data currently comes from `src/data.js` via a mock `fetchDashboardData()` that resolves after ~900ms — this is what drives the loading skeletons. Swap that function for a real `fetch()` call to the Task 2 REST API to connect this to live data without touching any component code.
