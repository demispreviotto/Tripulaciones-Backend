const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title for the Todo"],
        },
        description: {
            type: String,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = Todo;