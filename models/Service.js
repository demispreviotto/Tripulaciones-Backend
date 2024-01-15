const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const ServiceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Por favor inserte el nombre de la empresa"],
    },
    theme: [
      {
        type: String,
        required: [true, "Por favor inserte el tema"],
      },
    ],
    contactNumber: {
      type: Number,
      required: [true, "Por favor inserte el número de contacto"],
    },
    contactEmail: {
      type: String,
      required: [true, "Por favor inserte el correo de contacto"],
    },
    rate: [{ type: Number }],
    incidenceIds: [{ type: ObjectId, ref: "Incidence" }],
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", ServiceSchema);

module.exports = Service;
