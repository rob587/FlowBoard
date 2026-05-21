// 4 funzioni
// getAllBoards() - SELECT * FROM boards
// getBoardById(id) - SELECT WHERE id
// createBoard(title, description) - INSERT
// deleteBoard(id) - DELETE WHERE id

const pool = require("../db");

const getAllBoards = async () => {
  try {
    const result = await pool.query(
      "SELECT * FROM boards ORDER BY created_at DESC",
    );
    return result.rows;
  } catch (err) {
    console.error("errore nel recupero delle boards:", err);
    throw err;
  }
};
