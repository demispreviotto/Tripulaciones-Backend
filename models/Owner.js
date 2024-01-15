const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const OwnerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Por favor inserte el nombre del propietario"],
    },
    lastName: {
      type: String,
      required: [true, "Por favor inserte el apellido del propietario"],
    },
    phone: {
      type: String,
      required: [
        true,
        "Por favor inserte el número de teléfono del propietario",
      ],
    },
    email: {
      type: String,
      required: [true, "Por favor inserte el correo del propietario"],
    },
    doorIds: [{ type: ObjectId, ref: "Door" }],
    incidenceIds: [{ type: ObjectId, ref: "Incidence" }],
    buildingIds: [{ type: ObjectId, ref: "Building" }],
  },
  { timestamps: true }
);

const Owner = mongoose.model("Owner", OwnerSchema);

module.exports = Owner;
