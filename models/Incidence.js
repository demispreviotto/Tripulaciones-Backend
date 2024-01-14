const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const IncidenceSchema = new mongoose.Schema(
  {
    summary: String,
    category: String,
    originalMessage: String,
    status: String,
    doorIds: [{ type: ObjectId, ref: "Door" }],
    ownerIds: [{ type: ObjectId, ref: "Owner" }],
    buildingId: { type: ObjectId, ref: "Building" },
  },
  { timestamps: true }
);

const Incidence = mongoose.model("Incidence", IncidenceSchema);

module.exports = Incidence;
