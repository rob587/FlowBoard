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
