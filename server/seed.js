// Run once with: npm run seed
// Creates your admin login (from .env) and one sample project so the
// site isn't empty on first deploy. Safe to run again — it won't
// duplicate the admin account.

require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const Project = require("./models/Project");

async function seed() {
  await connectDB();

  // --- Admin account ---
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file first.");
    process.exit(1);
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin account already exists for ${email} — skipping.`);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ email, passwordHash });
    console.log(`Admin account created for ${email}.`);
  }

  // --- Sample project (only if none exist yet) ---
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.create({
      title: "Add your first real project",
      description:
        "This is a placeholder. Log into /admin and replace it with one of your real GitHub projects.",
      tags: ["Getting started"],
      githubUrl: "https://github.com/SALAHDDINEDKAKI",
      liveUrl: "",
      order: 0,
    });
    console.log("Sample project created.");
  } else {
    console.log("Projects already exist — skipping sample project.");
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
