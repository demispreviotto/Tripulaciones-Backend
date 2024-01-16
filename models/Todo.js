const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Por favor inserte el título de la tarea"],
    },
    description: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    buildingId: [{ type: ObjectId, ref: "Building" }],
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = Todo;
