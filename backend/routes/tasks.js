const express = require("express");
const router = express.Router();

const {
  getTasksByBoardIdController,
  getTaskByIdController,
  createTaskController,
  updateTaskController,
  deleteTaskController,
} = require("../controllers/taskController");

router.get("/board/:boardId", getTasksByBoardIdController);
router.get("/:id", getTaskByIdController);
router.post("/board/:boardId", createTaskController);
router.put("/:id", updateTaskController);
router.delete("/:id", deleteTaskController);

module.exports = router;
