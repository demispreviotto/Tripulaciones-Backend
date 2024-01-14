const Todo = require("../models/Todo");

const TodoController = {
    async createTodo(req, res) {
        try {
            const todo = await Todo.create(req.body);
            res.status(201).send({ message: "Todo created successfully", todo });
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "Unexpected error creating the Todo" });
        }
    },

    async getAllTodo(req, res) {
        try {
            const todos = await Todo.find();
            res.send(todos);
            if (todos.length < 1) {
                return res.send({ message: "There are no Todos" });
            }
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "Unexpected error looking for the Todos" });
        }
    },

    async getTodoById(req, res) {
        try {
            const todo = await Todo.findById(req.params.id);
            if (!todo) {
                return res.status(404).send({ message: "Todo not found" });
            }
            res.send(todo);
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "Unexpected error looking for the Todo" });
        }
    },

    async updateTodo(req, res) {
        try {
            const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            if (!todo) {
                return res.status(404).send({ message: "Todo not found" });
            }
            res.send({ message: "Todo updated successfully", todo });
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "Unexpected error updating the Todo" });
        }
    },

    async deleteTodo(req, res) {
        try {
            const todo = await Todo.findByIdAndDelete(req.params.id);
            if (!todo) {
                return res.status(404).send({ message: "Todo not found" });
            }
            res.status(200).send({ message: "Todo deleted successfully", todo });
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "Unexpected error deleting the Todo" });
        }
    },
};

module.exports = TodoController;
