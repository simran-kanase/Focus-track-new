const mongoose = require("mongoose");

const schedulerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  task: String,
  date: String,
  time: String,
});

module.exports = mongoose.model("Scheduler", schedulerSchema);
