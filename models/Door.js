const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const DoorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Por favor inserte el nombre de la puerta"],
    },
    incidenceIds: [{ type: ObjectId, ref: "Incidence" }],
    ownerIds: [{ type: ObjectId, ref: "Owner" }],
    buildingId: { type: ObjectId, ref: "Building" },
  },
  { timestamps: true }
);

const Door = mongoose.model("Door", DoorSchema);

module.exports = Door;
