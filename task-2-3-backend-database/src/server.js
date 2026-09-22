const app = require("./app");
const sequelize = require("./config/database");
require("./models"); // registers associations

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✔ Database connection established");

    // sync() creates tables from models if they don't exist yet.
    // For production, prefer proper migrations — this is fine for the
    // internship's demo/grading scope.
    await sequelize.sync();
    console.log("✔ Models synced");

    app.listen(PORT, () => {
      console.log(`✔ devflow API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("✘ Failed to start server:", err);
    process.exit(1);
  }
}

start();
