// const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");


let employees = [];

function createEmployee(data) {
  const employee = { 
    id: crypto.randomUUID(),
    empId: data.empId, 
    name: data.name,
    email: data.email,
    department: data.department,
    salary: data.salary,
  };
  employees.push(employee);
  return employee;
}

module.exports = {
  employees,
  createEmployee,
};


