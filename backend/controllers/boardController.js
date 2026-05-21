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
