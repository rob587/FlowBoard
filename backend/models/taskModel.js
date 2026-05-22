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

const getTaskById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.log("errore nel recupero della task:", err);
    throw err;
  }
};

const createTask = async (boardId, title, description) => {
  try {
    const result = await pool.query(
      "INSERT INTO tasks (board_id, title, description) VALUES ($1, $2, $3) RETURNING *",
      [boardId, title, description],
    );
    return result.rows[0];
  } catch (err) {
    console.log("errore nella creazione della task:", err);
    throw err;
  }
};
