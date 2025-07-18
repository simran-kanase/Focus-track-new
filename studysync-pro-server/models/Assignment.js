const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: String,
  title: String,
  dueDate: String,
});

module.exports = mongoose.model("Assignment", assignmentSchema);
