const {
  getTasksByBoardId,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../models/taskModel");

// 5 funzioni per il controller delle task stesso flusso delle board

const getTasksByBoardIdController = async (req, res) => {
  try {
    const { boardId } = req.params;
    const tasks = await getTasksByBoardId(boardId);
    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTaskByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await getTaskById(id);
    if (!task) return res.status(404).json({ error: "task non trovata!" });
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTaskController = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, description, dueDate, priority } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });

    const task = await createTask(
      boardId,
      title,
      description,
      dueDate,
      priority,
    );

    req.io.to(`board:${boardId}`).emit("task:created", task);

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, position, boardId, dueDate, priority } =
      req.body;

    const task = await updateTask(
      id,
      title,
      description,
      status,
      position,
      dueDate,
      priority,
    );

    req.io.to(`board:${boardId}`).emit("task:updated", task);

    if (!task) return res.status(404).json({ error: "task non trovata!" });
    res.json({ success: true, task });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: err.message });
  }
};

const deleteTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    const { boardId } = req.body;

    const task = await deleteTask(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    req.io.to(`board:${boardId}`).emit("task:deleted", { id });

    res.json({ success: true, task });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTaskByIdController,
  getTasksByBoardIdController,
  createTaskController,
  updateTaskController,
  deleteTaskController,
};
