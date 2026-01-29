const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/employees.json");

// Read employees from JSON file
function readEmployees() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Write employees to JSON file
function writeEmployees(employees) {
  fs.writeFileSync(filePath, JSON.stringify(employees, null, 2));
}

module.exports = { readEmployees, writeEmployees };
