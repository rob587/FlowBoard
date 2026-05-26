const {
  getTasksByBoardId,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../models/taskModel");

const io = require("../index");
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
    const { title, description } = req.body;
    if (!title) return res.status(404).json({ error: "titolo obbligatorio!" });
    const task = await createTask(boardId, title, description);
    io.to(`board:${boardId}`).emit("task:created", task);
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const updateTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, position } = req.body;
    const task = await updateTask(id, title, description, status, position);
    io.to(`board:${boardId}`).emit("task:updated", task);
    if (!task) return res.status(404).json({ error: "task non trovata!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await deleteTask(id);
    if (!task) return res.status(404).json({ error: "task non trovata!" });
    io.to(`board:${boardId}`).emit("task:deleted", { id });
    res.json({ success: true, task });
  } catch (err) {
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
