const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const DoorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the name of the door"],
    },
    incidenceIds: [{ type: ObjectId, ref: "Incidence" }],
    ownerIds: [{ type: ObjectId, ref: "Owner" }],
    // serviceIds: [{ type: ObjectId, ref: "Service" }],
    buildingId: { type: ObjectId, ref: "Building" },
  },
  { timestamps: true }
);

const Door = mongoose.model("Door", DoorSchema);

module.exports = Door;
