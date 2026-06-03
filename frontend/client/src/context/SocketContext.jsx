import React from "react";
import { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const [currentBoardId, setCurrentBoardId] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    console.log("connessione a Socket.IO..");

    newSocket.on("connect", () => {
      console.log("Connesso al Server!");
    });

    newSocket.on("board:created", (board) => {
      console.log("🎉 Board created:", board);
      setBoards((prev) => [...prev, board]);
    });

    newSocket.on("board:deleted", (data) => {
      console.log("Board Cancellata", data.id);

      const boardIdToDelete = parseInt(data.id);

      setBoards((prev) => prev.filter((b) => b.id !== boardIdToDelete));

      setTasks((prev) => prev.filter((t) => t.board_id !== boardIdToDelete));

      setCurrentBoardId((prev) => (prev === boardIdToDelete ? null : prev));
    });

    newSocket.on("task:created", (task) => {
      console.log("Task Creata!:", task);
      setTasks((prev) => [...prev, task]);
    });

    newSocket.on("task:updated", (task) => {
      console.log("Task Aggiornata:", task);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    });

    let taskDeletedListenerCount = 0;

    newSocket.on("task:deleted", (data) => {
      console.log("🗑️ Task deleted event:", data);

      // NON usare currentBoardId! Filtra direttamente per task.id
      setTasks((prev) => {
        const filtered = prev.filter((t) => t.id !== parseInt(data.id));
        console.log("Tasks after filter:", filtered.length);
        return filtered;
      });
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnesso dal Server");
    });

    return () => {
      newSocket.removeAllListeners();
      newSocket.disconnect();
    };
  }, []);

  const loadBoards = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/boards");
      const data = await response.json();
      setBoards(data.boards);
    } catch (err) {
      console.error("errore nel caricare le boards", err);
    }
  };

  const loadTasks = async (boardId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/board/${boardId}`,
      );
      const data = await response.json();
      setTasks(data.tasks);
      setCurrentBoardId(boardId);

      if (socket) {
        socket.emit("join:board", boardId);
      }
    } catch (err) {
      console.error("Errore nel caricare le task:", err);
    }
  };

  const createBoard = async (title, description) => {
    try {
      const response = await fetch("http://localhost:5000/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const data = await response.json();
      setBoards([...boards, data.board]);
      return data.board;
    } catch (err) {
      console.error("Errore nella creazione della board:", err);
    }
  };

  const deleteBoard = async (boardId) => {
    try {
      console.log("🗑️ Deleting task:", taskId);
      const response = await fetch(
        `http://localhost:5000/api/boards/${boardId}`,
        {
          method: "DELETE",
        },
      );

      console.log("Response status:", response.status);

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Fallito nel cancellare la board");
      }

      console.log("Board Cancellata");
      console.log("✅ Task deleted successfully");
    } catch (err) {
      console.error("Errore nel cancellare la Board", err);
    }
  };

  const createTask = async (boardId, title, description) => {
    try {
      if (socket) {
        socket.emit("join:board", boardId);
      }

      const response = await fetch(
        `http://localhost:5000/api/tasks/board/${boardId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      const data = await response.json();
      console.log("📝 Task response:", data);

      return data.task;
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const updateTask = async (taskId, title, description, status, position) => {
    try {
      console.log("Aggiornando la task:", taskId, "allo stato:", status);
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            status,
            position,
            boardId: currentBoardId,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Errore nell'aggiornamento della task");
      }

      const data = await response.json();

      console.log("Task Aggiornata:", data);

      return data.task;
    } catch (err) {
      console.error("Errore nell'aggiornamento della task:", err);
    }
  };

  const deleteTask = async (taskId, boardId) => {
    try {
      // ← AGGIUNGI QUESTO!
      if (socket) {
        socket.emit("join:board", boardId);
      }

      console.log("🗑️ Deleting task:", taskId);

      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ boardId }),
        },
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      console.log("✅ Task deleted successfully");
    } catch (err) {
      console.error("Errore nella cancellazione della task", err);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        tasks,
        boards,
        currentBoardId,
        loadBoards,
        loadTasks,
        createBoard,
        deleteBoard,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
