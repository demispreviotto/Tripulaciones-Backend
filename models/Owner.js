const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaType.ObjectId;

const OwnerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter the name of the owner"],
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
    doorId: [{ type: ObjectId, ref: "Door" }],
  },
  { timestamps: true }
);

const Owner = mongoose.model("Owner", OwnerSchema);

module.exports = Owner;
