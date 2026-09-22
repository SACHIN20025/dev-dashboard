# devflow API

**Tasks 2 & 3 — Innovation Hacks Full Stack Development Internship**
**REST API + persistent database layer, with Task 4's AI feature included.**

A Node.js + Express REST API for users, projects, and tasks, backed by a real relational database via Sequelize, with JWT authentication and an AI-assisted task generation / summarization endpoint.

## Features

**Task 2 — REST API**
- User management endpoints (register, login, profile, update, delete)
- Project creation, retrieval, update, delete
- Task creation, update, deletion, and dedicated status-transition endpoint
- Centralized error handling with consistent JSON error shapes
- Input validation on every write operation (`express-validator`)
- Correct, meaningful HTTP status codes (200/201/204/400/401/403/404/409/500)
- Environment variables for all configuration and secrets
- This README doubles as the API documentation (endpoint table below)

**Task 3 — Persistent Data Layer**
- Real database via Sequelize (SQLite by default, MySQL/Postgres by changing one env var)
- Full CRUD across Users, Projects, and Tasks
- Schema-level validation (required fields, email format, enums, string lengths)
- Relationships: User → Projects (owner), Project → Tasks, User → Tasks (assignee), with cascading deletes
- Secure configuration — no hard-coded credentials, everything reads from `.env`

**Task 4 — AI feature**
- `POST /api/ai/generate-tasks` — turns a plain-English project description into a starter task list
- `GET /api/ai/projects/:id/summary` — generates a short status summary from a project's current tasks
- Uses the Anthropic API when `ANTHROPIC_API_KEY` is set; falls back to a local heuristic otherwise, so the feature (and any UI built on it) still works in a demo without a key configured

## Tech Stack

- Node.js + Express
- Sequelize ORM (SQLite by default; MySQL/PostgreSQL supported via env var)
- JSON Web Tokens (`jsonwebtoken`) for auth, `bcryptjs` for password hashing
- `express-validator` for request validation
- `@anthropic-ai/sdk` for the AI feature

## Project Structure

```
src/
├── app.js                    # Express app, route mounting, error handlers
├── server.js                  # DB connection + server bootstrap
├── config/
│   └── database.js            # Sequelize config (dialect from env)
├── models/
│   ├── User.js / Project.js / Task.js
│   └── index.js                # Associations
├── middleware/
│   ├── auth.js                  # JWT verification
│   ├── validate.js              # express-validator result handler
│   └── errorHandler.js          # Central error formatting + 404s
├── controllers/
│   ├── authController.js / userController.js
│   ├── projectController.js / taskController.js
│   └── aiController.js
├── routes/
│   └── ...one file per resource, mounted under /api/*
└── utils/
    └── seed.js                  # Populates demo data
```

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# then edit .env — at minimum, set JWT_SECRET to a random string

# 3. (Optional) seed demo data — creates two users, two projects, five tasks
npm run seed
# Login with: riya@devflow.io / password123

# 4. Start the server
npm run dev      # with auto-reload (nodemon)
# or
npm start
```

The API runs at `http://localhost:5000` by default. Health check: `GET /api/health`.

## Switching Databases (Task 3)

By default this uses a local SQLite file (`./data/devflow.sqlite`) — zero setup required. To point it at real MySQL or PostgreSQL instead, edit `.env`:

```bash
DB_DIALECT=postgres        # or "mysql"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=devflow
DB_USER=postgres
DB_PASSWORD=your-password
```

No code changes needed — Sequelize abstracts the dialect.

## Environment Variables

See `.env.example` for the full list with comments. Never commit a real `.env` file — it's already in `.gitignore`.

## API Reference

All responses are JSON, shaped as `{ success, data }` or `{ success: false, message, errors? }`. Protected routes require `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create an account. Body: `name, email, password` |
| POST | `/api/auth/login` | – | Log in. Body: `email, password`. Returns `{ user, token }` |
| GET | `/api/auth/me` | ✅ | Get the current authenticated user |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users` | ✅ | List all users |
| GET | `/api/users/:id` | ✅ | Get one user |
| PATCH | `/api/users/:id` | ✅ | Update name (self or admin only) |
| DELETE | `/api/users/:id` | ✅ | Delete a user (self or admin only) |

### Projects

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/projects?status=&search=` | ✅ | List projects, with per-project progress % |
| GET | `/api/projects/:id` | ✅ | Get one project with its tasks |
| POST | `/api/projects` | ✅ | Create a project. Body: `name, description?, status?, dueDate?` |
| PATCH | `/api/projects/:id` | ✅ | Update a project (owner or admin only) |
| DELETE | `/api/projects/:id` | ✅ | Delete a project and its tasks (owner or admin only) |

### Tasks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/tasks?status=&priority=&projectId=&search=` | ✅ | List/filter/search tasks |
| GET | `/api/tasks/:id` | ✅ | Get one task |
| POST | `/api/tasks` | ✅ | Create a task. Body: `title, projectId, description?, status?, priority?, dueDate?, assigneeId?` |
| PATCH | `/api/tasks/:id` | ✅ | Update task fields |
| PATCH | `/api/tasks/:id/status` | ✅ | Update just the status. Body: `{ status }` |
| DELETE | `/api/tasks/:id` | ✅ | Delete a task |

### AI (Task 4)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/ai/generate-tasks` | ✅ | Body: `{ description, projectId? }` → array of suggested `{ title, priority }` |
| GET | `/api/ai/projects/:projectId/summary` | ✅ | Returns `{ summary }`, a short natural-language status update |

## Example Requests

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Riya Kapoor","email":"riya@devflow.io","password":"password123"}'

# Create a project (use the token from register/login)
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Orbit Billing API","description":"Billing engine","dueDate":"2026-09-12"}'

# Ask the AI feature for a starter task list
curl -X POST http://localhost:5000/api/ai/generate-tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"description":"Build a notifications system supporting email and push, with rate limiting."}'
```

## Error Shape

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "A valid email is required" }]
}
```

## Notes for Evaluation

- Every write route validates input and returns 400 with field-level errors on failure.
- Ownership checks return 403 (not 404) when a user tries to edit/delete something they don't own, except where that would leak existence — kept simple here for clarity.
- `npm run seed` resets and repopulates the database so a grader can see live CRUD immediately without manual setup.
