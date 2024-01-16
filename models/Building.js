const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const BuildingSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, "Por favor inserte la dirección de la finca"],
    },
    number: {
      type: Number,
      required: [true, "Por favor inserte el número de la dirección"],
    },
    zipCode: {
      type: Number,
      required: [true, "Por favor inserte el código postal"],
    },
    city: {
      type: String,
      required: [true, "Por favor inserte la ciudad"],
    },
    province: {
      type: String,
      required: [true, "Por favor inserte la comunidad"],
    },
    createdBy: [{ type: ObjectId, ref: "User" }],
    serviceIds: [{ type: ObjectId, ref: "Service" }],
    doorIds: [{ type: ObjectId, ref: "Door" }],
    incidenceIds: [{ type: ObjectId, ref: "Incidence" }],
    todoIds: [{ type: ObjectId, ref: "Todo" }],
    ownerIds: [{ type: ObjectId, ref: "Owner" }],
  },
  { timestamps: true }
);

const Building = mongoose.model("Building", BuildingSchema);

module.exports = Building;
