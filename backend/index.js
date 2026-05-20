const express = require("express");
const cors = require("cors");
const pool = require("../backend/db");
require("dotenv").config();

console.log("avvio server in corso..");

const app = express();

app.use(cors());
app.use(express.json());

// status

app.get("/", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
console.log(`tentativo di ingresso sulla porta: ${PORT} `);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server aperto in http://0.0.0.0:${PORT}`);
});
