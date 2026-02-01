const { v4: uuidv4 } = require("uuid");

let employees = [];

function createEmployee(data) {
  const employee = { 
    id: uuidv4(),
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


