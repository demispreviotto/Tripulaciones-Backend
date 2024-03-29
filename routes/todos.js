const express = require("express");
const router = express.Router();

const TodoController = require("../controllers/TodoController");
const { authentication } = require("../middleware/authentication");

router.post("/create", authentication, TodoController.createTodo);
router.get("/getAll", TodoController.getAllTodo);
router.get("/getById/:id", TodoController.getTodoById);
router.put("/update/:id", authentication, TodoController.updateTodo);
router.delete("/delete/:id", authentication, TodoController.deleteTodo);

module.exports = router;
