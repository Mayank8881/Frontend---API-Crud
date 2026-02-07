const express = require("express");
const cors = require("cors");

const employeeRoutes = require("../routes/Routes");

const app = express();

app.use(cors());
app.use(express.json());

// IMPORTANT: On Vercel, this will be served at /api
app.use("/api/employees", employeeRoutes);

module.exports = app;
