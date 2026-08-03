const express = require("express");
const nodemailer = require("nodemailer");
const Message = require("../models/Message");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

function getTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_APP_PASSWORD) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_APP_PASSWORD,
    },
  });
}

// POST /api/contact — public, used by the contact form
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const saved = await Message.create({ name, email, subject, message });

    // Email notification is optional — only runs if SMTP_* is set in .env.
    // The message is already saved above either way, so nothing is lost
    // if this part is skipped or fails.
    const transporter = getTransporter();
    if (transporter && process.env.NOTIFY_EMAIL) {
      transporter
        .sendMail({
          from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
          to: process.env.NOTIFY_EMAIL,
          replyTo: email,
          subject: `New portfolio message: ${subject}`,
          text: `From: ${name} (${email})\n\n${message}`,
        })
        .catch((err) => console.error("Email notification failed:", err.message));
    }

    res.status(201).json({ success: true, id: saved._id });
  } catch (err) {
    res.status(500).json({ error: "Could not send message. Please try again." });
  }
});

// GET /api/contact — admin only, view all messages
router.get("/", requireAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Could not load messages." });
  }
});

// PATCH /api/contact/:id/read — admin only, mark as read
router.patch("/:id/read", requireAdmin, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!msg) return res.status(404).json({ error: "Message not found." });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: "Could not update message." });
  }
});

// DELETE /api/contact/:id — admin only
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ error: "Message not found." });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Could not delete message." });
  }
});

module.exports = router;
