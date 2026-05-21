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

// -----------

const getBoardById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM boards WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.error("errore nel recupero della board:", err);
    throw err;
  }
};

// ---------

const createBoard = async (title, description) => {
  try {
    const result = await pool.query(
      "INSERT INTO boards (title, description) VALUES ($1, $2) RETURNING *",
      [title, description],
    );
    return result.rows[0];
  } catch (err) {
    console.error("errore nella creazione della board", err);
    throw err;
  }
};

//------------

const deleteBoard = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM boards WHERE id = $1 RETURNING *",
      [id],
    );
    return result.rows[0];
  } catch (err) {
    console.error("errore nella cancellazione della board", err);
    throw err;
  }
};

module.exports = {
  getAllBoards,
  getBoardById,
  createBoard,
  deleteBoard,
};
