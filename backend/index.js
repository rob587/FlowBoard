const express = require("express");
const cors = require("cors");
const pool = require("../backend/db");
require("dotenv").config();

console.log("avvio server in corso..");

const app = express();

app.use(cors());
app.use(express.json());
