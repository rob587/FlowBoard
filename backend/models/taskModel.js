// 4 funzioni ma per le tasks

const pool = require("../db");

const getTasksByBoardId = async (boardId) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE board_id = $1 ORDER BY position ASC",
      [boardId],
    );
    return result.rows;
  } catch (err) {
    console.log("errore nel recupero delle tasks:", err);
    throw err;
  }
};
