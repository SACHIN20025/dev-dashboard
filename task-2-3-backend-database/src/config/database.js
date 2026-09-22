const { Sequelize } = require("sequelize");
const path = require("path");
require("dotenv").config();

// -----------------------------------------------------------------------
// TASK 3 — Persistent Data Layer
// -----------------------------------------------------------------------
// Dialect is driven entirely by env vars — no hard-coded credentials.
// Defaults to a local SQLite file so the whole stack runs with zero
// external services (ideal for grading/demoing). Swap DB_DIALECT to
// "postgres" or "mysql" and fill in the host/user/password fields in
// .env to point this at a real MySQL/PostgreSQL instance — no code
// changes required, Sequelize abstracts the dialect.
// -----------------------------------------------------------------------

const dialect = process.env.DB_DIALECT || "sqlite";

let sequelize;

if (dialect === "sqlite") {
  const storage = process.env.DB_STORAGE || "./data/devflow.sqlite";
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.resolve(storage),
    logging: false,
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect, // "postgres" | "mysql"
      logging: false,
    }
  );
}

module.exports = sequelize;
