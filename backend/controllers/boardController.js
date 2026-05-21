const {
  getAllBoards,
  getBoardbyId,
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
    const board = await getBoardbyId(id);
    if (!board) return res.status(404).json({ error: "Board non trovata" });
    res.json({ success: true, board });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
