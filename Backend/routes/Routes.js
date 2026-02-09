
/**
 * Employee Routes
 * ----------------
 * Small in-memory CRUD for demo / assignment purposes.
 * Routes provided:
 *  - POST  /            : create a new employee (body: { empId, email, ... })
 *  - GET   /            : list all employees
 *  - DELETE /by-id/:id  : delete by internal `id` (cleanup route)
 *  - PUT   /:empId      : update an employee identified by `empId`
 *  - DELETE /:empId     : delete an employee by `empId`
 */

const express = require("express");
const { employees, createEmployee } = require("../data/employee");

const router = express.Router();

/**
 * Create employee
 * POST /
 * Body: { empId, email, ... }
 * Validations:
 *  - `empId` is required and must be unique
 *  - `email` is required and must be unique
 * Responses:
 *  - 400: validation error
 *  - 200: created employee object
 */
router.post("/", (req, res) => {
  const { empId, email } = req.body;

  // empId required (prevents blank/undefined records)
  if (!empId || empId.trim() === "") {
    return res.status(400).json({ message: "Employee ID is required" });
  }

  // email required
  if (!email || email.trim() === "") {
    return res.status(400).json({ message: "Email is required" });
  }

  // Unique Employee ID check
  const empIdExists = employees.find((e) => e.empId === empId);
  if (empIdExists) {
    return res.status(400).json({ message: "Employee ID already exists" });
  }

  // Unique email check
  const emailExists = employees.find((e) => e.email === email);
  if (emailExists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const employee = createEmployee(req.body);
  res.json(employee);
});

/**
 * Read - list all employees
 * GET /
 * Response: array of employee objects
 */
router.get("/", (req, res) => {
  res.json(employees);
});

/**
 * Delete by internal id
 * DELETE /by-id/:id
 * Note: this route removes by the internal `id` field (not `empId`).
 * It is useful for administrative cleanup in this demo app.
 */
router.delete("/by-id/:id", (req, res) => {
  const { id } = req.params;

  const index = employees.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Employee not found" });
  }

  employees.splice(index, 1);
  res.json({ message: "Employee deleted" });
});

/**
 * Update employee by `empId`
 * PUT /:empId
 * Body: fields to update (email, name, etc.)
 * Rules:
 *  - `empId` in path identifies the record and CANNOT be changed via body
 *  - email must remain unique across employees
 */
router.put("/:empId", (req, res) => {
  const { empId } = req.params;
  const { email } = req.body;

  const index = employees.findIndex((e) => e.empId === empId);

  if (index === -1) {
    return res.status(404).json({ message: "Employee not found" });
  }

  // Prevent duplicate email (allow same email for current record)
  const emailConflict = employees.find(
    (e) => e.email === email && e.empId !== empId
  );

  if (emailConflict) {
    return res.status(400).json({ message: "Email already exists" });
  }

  // Merge updates but ensure `empId` stays unchanged
  employees[index] = {
    ...employees[index],
    ...req.body,
    empId: employees[index].empId
  };

  res.json(employees[index]);
});

/**
 * Delete by `empId`
 * DELETE /:empId
 */
router.delete("/:empId", (req, res) => {
  const { empId } = req.params;

  const index = employees.findIndex((e) => e.empId === empId);

  if (index === -1) {
    return res.status(404).json({ message: "Employee not found" });
  }

  employees.splice(index, 1);
  res.json({ message: "Employee deleted" });
});

module.exports = router;
