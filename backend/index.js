const express = require("express");
const cors = require("cors");
const pool = require("../backend/db");
require("dotenv").config();
const http = require("http");
const setupSocket = require("./socket");

console.log("avvio server in corso..");

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);

app.use(cors());
app.use(express.json());

// status

app.get("/", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
console.log(`tentativo di ingresso sulla porta: ${PORT} `);

const boardRoutes = require("../backend/routes/boards");
app.use("/api/boards", boardRoutes);

const taskRoutes = require("./routes/tasks");
app.use("/api/tasks", taskRoutes);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server aperto in http://0.0.0.0:${PORT}`);
});

module.exports = io;
