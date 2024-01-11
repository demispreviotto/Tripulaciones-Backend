const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const UserSchema = new mongoose.Schema(
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
    role: {
      type: String,
      default: "user",
    },
    tokens: [],
    buildingIds: [{ type: ObjectId, ref: "Building" }],
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.tokens;
  delete user.password;
  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
