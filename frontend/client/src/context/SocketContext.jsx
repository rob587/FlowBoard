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
      console.log("🗑️ Board cancellata:", data.id);
      setBoards((prev) => prev.filter((b) => b.id !== data.id));

      if (currentBoardId === data.id) {
        setCurrentBoardId(null);
      }
    });

    newSocket.on("task:created", (task) => {
      console.log("Task Creata!:", task);
      setTasks((prev) => [...prev, task]);
    });

    newSocket.on("task:updated", (task) => {
      console.log("Task Aggiornata:", task);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    });

    newSocket.on("task:deleted", (data) => {
      console.log("🗑️ Received task:deleted event:", data);
      setTasks((prev) => {
        const filtered = prev.filter((t) => t.id !== parseInt(data.id));
        console.log("Tasks after filter:", filtered);
        return filtered;
      });
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnesso dal Server");
    });

    return () => {
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
      const response = await fetch(
        `http://localhost:5000/api/boards/${boardId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Fallito nel cancellare la board");
      }

      console.log("Board Cancellata");
    } catch (err) {
      console.error("Errore nel cancellare la Board", err);
    }
  };

  const createTask = async (boardId, title, description) => {
    try {
      // ✅ SEMPLICEMENTE EMIT join:board quando crei
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
        // ← AGGIUNGI QUESTO
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
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, status, position }),
        },
      );
      const data = await response.json();

      return data.task;
    } catch (err) {
      console.error("Errore nell'aggiornamento della task:", err);
    }
  };

  const deleteTask = async (taskId, boardId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ boardId }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      console.log("🗑️ Task deleted");
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
