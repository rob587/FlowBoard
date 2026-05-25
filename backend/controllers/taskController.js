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
