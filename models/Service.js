const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaType.ObjectId;

const ServiceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please enter the name of the company"],
    },
    incidenceIds: [{ type: ObjectId, ref: "Incidence" }],
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
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", ServiceSchema);

module.exports = Service;
