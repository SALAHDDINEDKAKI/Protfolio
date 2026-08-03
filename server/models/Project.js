const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    githubUrl: { type: String, trim: true, default: "" },
    liveUrl: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0 }, // lower shows first
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
