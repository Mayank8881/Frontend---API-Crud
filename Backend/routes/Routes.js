// const express = require("express");
// const { employees, createEmployee } = require("../data/employee");

// const router = express.Router();

// /* CREATE */
// router.post("/", (req, res) => {
//   const { empId, email } = req.body;

//   // Unique Employee ID check
//   const empIdExists = employees.find(e => e.empId === empId);
//   if (empIdExists) {
//     return res.status(400).json({ message: "Employee ID already exists" });
//   }

//   // Optional: unique email check
//   const emailExists = employees.find(e => e.email === email);
//   if (emailExists) {
//     return res.status(400).json({ message: "Email already exists" });
//   }

//   const employee = createEmployee(req.body);
//   res.json(employee);
// });

// /* READ */
// router.get("/", (req, res) => {
//   res.json(employees);
// });

// /* UPDATE */
// /* UPDATE by empId */
// router.put("/:empId", (req, res) => {
//   const { empId } = req.params;
//   const { email } = req.body;

//   const index = employees.findIndex(e => e.empId === empId);

//   if (index === -1) {
//     return res.status(404).json({ message: "Employee not found" });
//   }

//   // Prevent duplicate email (optional but good)
//   const emailConflict = employees.find(
//     e => e.email === email && e.empId !== empId
//   );

//   if (emailConflict) {
//     return res.status(400).json({ message: "Email already exists" });
//   }

//   // empId should NEVER change
//   employees[index] = {
//     ...employees[index],
//     ...req.body,
//     empId: employees[index].empId
//   };

//   res.json(employees[index]);
// });

// /* DELETE by empId */
// router.delete("/:empId", (req, res) => {
//   const { empId } = req.params;

//   const index = employees.findIndex(e => e.empId === empId);

//   if (index === -1) {
//     return res.status(404).json({ message: "Employee not found" });
//   }

//   employees.splice(index, 1);
//   res.json({ message: "Employee deleted" });
// });
// module.exports = router;

const express = require("express");
const { employees, createEmployee } = require("../data/employee");

const router = express.Router();

/* CREATE */
router.post("/", (req, res) => {
  const { empId, email } = req.body;

  // ✅ empId required (prevents blank/undefined records)
  if (!empId || empId.trim() === "") {
    return res.status(400).json({ message: "Employee ID is required" });
  }

  // Optional: email required
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

/* READ */
router.get("/", (req, res) => {
  res.json(employees);
});

/* ✅ DELETE by internal id (cleanup route) */
router.delete("/by-id/:id", (req, res) => {
  const { id } = req.params;

  const index = employees.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Employee not found" });
  }

  employees.splice(index, 1);
  res.json({ message: "Employee deleted" });
});

/* UPDATE by empId */
router.put("/:empId", (req, res) => {
  const { empId } = req.params;
  const { email } = req.body;

  const index = employees.findIndex((e) => e.empId === empId);

  if (index === -1) {
    return res.status(404).json({ message: "Employee not found" });
  }

  // Prevent duplicate email
  const emailConflict = employees.find(
    (e) => e.email === email && e.empId !== empId
  );

  if (emailConflict) {
    return res.status(400).json({ message: "Email already exists" });
  }

  // empId should NEVER change
  employees[index] = {
    ...employees[index],
    ...req.body,
    empId: employees[index].empId
  };

  res.json(employees[index]);
});

/* DELETE by empId */
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
