// routes/subjectRoutes.js
const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Get all subjects for a user
router.get("/", authMiddleware, async (req, res) => {
  const subjects = await Subject.find({ userId: req.userId });
  res.json(subjects);
});

// ✅ Add a new subject
router.post("/", authMiddleware, async (req, res) => {
  const { name, marks } = req.body;
  const newSubject = new Subject({ name, marks, userId: req.userId });
  await newSubject.save();
  res.json(newSubject);
});

// ✅ Delete a subject
router.delete("/:id", authMiddleware, async (req, res) => {
  await Subject.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ success: true });
});

module.exports = router;
