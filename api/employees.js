const express = require("express");
const cors = require("cors");

const employeeRoutes = require("../Backend/routes/Routes");

const app = express();

app.use(cors());
app.use(express.json());

// this file is already under /api, so route is /api/employees
app.use("/api/employees", employeeRoutes);

module.exports = app;
