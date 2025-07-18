// models/Subject.js
const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  marks: Number,
});

module.exports = mongoose.model("Subject", subjectSchema);
