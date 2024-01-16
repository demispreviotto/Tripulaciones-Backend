const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Por favor inserte su nombre"],
    },
    lastName: {
      type: String,
      required: [true, "Por favor inserte su apellido"],
    },
    email: {
      type: String,
      required: [true, "Por favor inserte su correo"],
      unique: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: [true, "Por favor inserte su número de teléfono"],
    },
    password: {
      type: String,
      required: [true, "Por favor inserte su contraseña"],
    },
    role: {
      type: String,
      default: "user",
    },
    company: {
      type: String,
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
