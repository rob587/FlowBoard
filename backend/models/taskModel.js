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
    console.error("errore nel recupero delle tasks:", err);
    throw err;
  }
};

const getTaskById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.error("errore nel recupero della task:", err);
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
    console.error("errore nella creazione della task:", err);
    throw err;
  }
};

const updateTask = async (id, title, description, status, position) => {
  try {
    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, status = $3, position = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
      [title, description, status, position, id],
    );
    return result.rows[0];
  } catch (err) {
    console.error("errore nell'aggiornamento della task:", err);
    throw err;
  }
};

const deleteTask = async (id) => {
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id],
    );
    return result.rows[0];
  } catch (err) {
    console.error("errore nella cancellazione della task:", err);
    throw err;
  }
};

module.exports = {
  getTaskById,
  getTasksByBoardId,
  createTask,
  updateTask,
  deleteTask,
};
