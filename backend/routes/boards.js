const express = require("express");
const router = express.Router();
const {
  getAllBoardsController,
  getBoardByIdController,
  createBoardController,
  deleteBoardController,
} = require("../controllers/boardController");

router.get("/", getAllBoardsController);
router.get("/:id", getBoardByIdController);
router.post("/", createBoardController);
router.delete("/:id", deleteBoardController);

module.exports = router;
