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
};
