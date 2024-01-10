const mongoose = require("mongoose");

const AdministratorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your name"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: [true, "Please enter your phone number"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    company: {
      type: String,
      require: [true, "Please enter your company name"],
    },
    role: {
      type: String,
      default: "administrator",
    },
    confirmed: Boolean,
    tokens: [],
    buildingIds: [],
  },
  { timestamps: true }
);

AdministratorSchema.methods.toJSON = function () {
  const administrator = this._doc;
  delete administrator.tokens;
  delete administrator.password;
  return administrator;
};

const Administrator = mongoose.model("Administrator", AdministratorSchema);

module.exports = Administrator;
