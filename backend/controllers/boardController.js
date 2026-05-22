const {
  getAllBoards,
  getBoardById,
  createBoard,
  deleteBoard,
} = require("../models/boardModel");

const getAllBoardsController = async (req, res) => {
  try {
    const boards = await getAllBoards();
    res.json({ success: true, boards });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBoardByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const board = await getBoardById(id);
    if (!board) return res.status(404).json({ error: "Board non trovata" });
    res.json({ success: true, board });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createBoardController = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: "Titolo richiesto" });
    const board = await createBoard(title, description);
    res.json({ success: true, board });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteBoardController = async (req, res) => {
  try {
    const { id } = req.params;
    const board = await deleteBoard(id);
    if (!board) return res.status(404).json({ error: "Board non trovata" });
    res.json({ success: true, board });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  deleteBoardController,
  createBoardController,
  getAllBoardsController,
  getBoardByIdController,
};
