const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, async (req, res) => {
  const assignments = await Assignment.find({ userId: req.userId });
  res.json(assignments);
});

router.post("/", auth, async (req, res) => {
  const assignment = new Assignment({ ...req.body, userId: req.userId });
  await assignment.save();
  res.json(assignment);
});

router.delete("/:id", auth, async (req, res) => {
  await Assignment.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ success: true });
});

module.exports = router;
