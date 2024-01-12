const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const BuildingSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, "Please enter the address of the building"],
    },
    name: {
      type: String,
    },
    number: {
      type: Number,
      required: [true, "Please enter the address number"],
    },
    zipCode: {
      type: Number,
      required: [true, "Please enter the zip code"],
    },
    city: {
      type: String,
      required: [true, "Please enter the city"],
    },
    province: {
      type: String,
      required: [true, "Please enter the province"],
    },
    createdBy: [{ type: ObjectId, ref: "User" }],
    serviceIds: [{ type: ObjectId, ref: "Service" }],
    doorIds: [{ type: ObjectId, ref: "Door" }],
  },
  { timestamps: true }
);

const Building = mongoose.model("Building", BuildingSchema);

module.exports = Building;
