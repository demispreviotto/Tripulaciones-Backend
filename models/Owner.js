const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const OwnerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter the first name of the owner"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter the last name of the owner"],
    },
    phone: {
      type: String,
      required: [true, "Please enter the phone of the owner"],
    },
    email: {
      type: String,
      required: [true, "Please enter the email of the owner"],
    },
    doorIds: [{ type: ObjectId, ref: "Door" }],
    incidenceIds: [{ type: ObjectId, ref: "Incidence" }],
    buildingIds: [{ type: ObjectId, ref: "Building" }],
  },
  { timestamps: true }
);

const Owner = mongoose.model("Owner", OwnerSchema);

module.exports = Owner;
