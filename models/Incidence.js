const mongoose = require("mongoose");

const IncidenceSchema = new mongoose.Schema(
  {
    userId: String,
    summary: String,
    theme: String,
    originalMessage: String,
    // services: String,
    state: String,
  },
  { timestamps: true }
);

const Incidence = mongoose.model("Incidence", IncidenceSchema);

module.exports = Incidence;