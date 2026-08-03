const express = require("express");
const Project = require("../models/Project");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

// GET /api/projects — public, used by the portfolio homepage
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Could not load projects." });
  }
});

// POST /api/projects — admin only
router.post("/", requireAdmin, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: "Could not create project.", details: err.message });
  }
});

// PUT /api/projects/:id — admin only
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ error: "Project not found." });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: "Could not update project.", details: err.message });
  }
});

// DELETE /api/projects/:id — admin only
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found." });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Could not delete project." });
  }
});

module.exports = router;
