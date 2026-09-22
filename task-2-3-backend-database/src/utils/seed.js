// Populates the database with the same demo data the Task 1 frontend uses,
// so the whole stack looks identical whether you're viewing mock data or
// live API data. Run with: npm run seed
const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");
const { User, Project, Task } = require("../models");

async function seed() {
  await sequelize.sync({ force: true });

  const passwordHash = await bcrypt.hash("password123", 10);
  const riya = await User.create({ name: "Riya Kapoor", email: "riya@devflow.io", passwordHash });
  const meera = await User.create({ name: "Meera Shah", email: "meera@devflow.io", passwordHash });

  const orbit = await Project.create({
    name: "Orbit Billing API",
    description: "Usage-based billing engine with webhook delivery and retries.",
    status: "on-track",
    dueDate: "2026-09-12",
    ownerId: riya.id,
  });

  const northstar = await Project.create({
    name: "Northstar Dashboard",
    description: "Internal analytics dashboard for the growth team, built on React and D3.",
    status: "at-risk",
    dueDate: "2026-09-20",
    ownerId: meera.id,
  });

  await Task.bulkCreate([
    { title: "Fix race condition in webhook retry queue", status: "in-progress", priority: "high", projectId: orbit.id, assigneeId: riya.id, dueDate: "2026-09-07" },
    { title: "Write integration tests for invoice generator", status: "todo", priority: "medium", projectId: orbit.id, assigneeId: meera.id, dueDate: "2026-09-08" },
    { title: "Review Q3 usage-metering accuracy", status: "done", priority: "medium", projectId: orbit.id, assigneeId: riya.id, dueDate: "2026-08-25" },
    { title: "Design empty states for cohort charts", status: "todo", priority: "low", projectId: northstar.id, assigneeId: meera.id, dueDate: "2026-09-04" },
    { title: "Set up D3 zoom interactions on funnel view", status: "todo", priority: "medium", projectId: northstar.id, assigneeId: riya.id, dueDate: "2026-09-11" },
  ]);

  console.log("✔ Seed complete.");
  console.log("  Login with: riya@devflow.io / password123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
