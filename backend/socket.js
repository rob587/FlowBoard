const socketIO = require("socket.io");

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Utente collegato:", socket.id);
    socket.on("join:board", (boardId) => {
      socket.join(`board:${boardId}`);
      console.log(`Utente ${socket.id} si è unito alla board ${boardId}`);
    });
    socket.on("leave:board", (boardId) => {
      socket.leave(`board:${boardId}`);
      console.log(`Utente ${socket.id} ha lasciato la board ${boardId}`);
    });
    socket.on("disconnect", () => {
      console.log("Utente disconnesso:", socket.id);
    });
  });
  return io;
};

module.exports = setupSocket;
