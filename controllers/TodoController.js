const Todo = require("../models/Todo");

const TodoController = {
  async createTodo(req, res, next) {
    try {
      const todo = await Todo.create(req.body);
      res.status(201).send({ message: "Tarea creada exitosamente", todo });
    } catch (error) {
      next(error);
    }
  },

  async getAllTodo(req, res) {
    try {
      const todos = await Todo.find();
      res.send(todos);
      if (todos.length < 1) {
        return res.send({ message: "No hay tareas" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error en la búsqueda de las tareas" });
    }
  },

  async getTodoById(req, res) {
    try {
      const todo = await Todo.findById(req.params.id);
      if (!todo) {
        return res.status(404).send({ message: "Tarea no encontrada" });
      }
      res.send(todo);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error en la búsqueda de la tarea" });
    }
  },

  async updateTodo(req, res) {
    try {
      const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!todo) {
        return res.status(404).send({ message: "Tarea no encontrada" });
      }
      res.send({ message: "Tarea modificada exitosamente", todo });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error al modificar la tarea" });
    }
  },

  async deleteTodo(req, res) {
    try {
      const todo = await Todo.findByIdAndDelete(req.params.id);
      if (!todo) {
        return res.status(404).send({ message: "Tarea no encontrada" });
      }
      res.status(200).send({ message: "Tarea eliminada exitosamente", todo });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error al eliminar la tarea" });
    }
  },
};

module.exports = TodoController;
