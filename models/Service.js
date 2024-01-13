const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const ServiceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please enter the name of the company"],
    },
    theme: [
      {
        type: String,
        required: [true, "Please enter a theme"],
      },
    ],
    contactNumber: {
      type: Number,
      required: [true, "Please enter the contact number"],
    },
    contactEmail: {
      type: String,
      required: [true, "Please enter the contact email"],
    },
    rate: [{ type: Number }],
    incidenceIds: [{ type: ObjectId, ref: "Incidence" }],
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", ServiceSchema);

module.exports = Service;
