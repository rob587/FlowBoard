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

    newSocket.on("task:created", (task) => {
      console.log("Task Creata!:", task);
      setTasks((prev) => [...prev, task]);
    });

    newSocket.on("task:updated", (task) => {
      console.log("Task Aggiornata:", task);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    });

    newSocket.on("task:deleted", (data) => {
      console.log("Task Cancellata:", data.id);
      setTasks((prev) => prev.filter((t) => t.id !== data.id));
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
        socket.emit("join:board:", boardId);
      }
    } catch (err) {
      console.error("Errore nel caricare le task:", err);
    }
  };

  const createBoard = async () => {
    try {
      const response = awaitfetch("http://localhost:5000/api/boards", {
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

  const createTask = async (boardId, title, description) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/board/${boardId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        },
      );
      const data = await response.json();
      return data.task;
    } catch (err) {
      console.error("Errore nella creazione della task:", err);
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

  const deleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Errore nella cancellazione della task", err);
    }
  };
};
