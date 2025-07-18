const express = require("express");
const router = express.Router();
const Scheduler = require("../models/Scheduler");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, async (req, res) => {
  const tasks = await Scheduler.find({ userId: req.userId });
  res.json(tasks);
});

router.post("/", auth, async (req, res) => {
  const task = new Scheduler({ ...req.body, userId: req.userId });
  await task.save();
  res.json(task);
});

router.delete("/:id", auth, async (req, res) => {
  await Scheduler.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ success: true });
});

module.exports = router;
