const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const employeesPath = path.join(__dirname, "../data/employees.json");
const attendancePath = path.join(__dirname, "../data/attendance.json");
const payrollPath = path.join(__dirname, "../data/payroll.json");

// create payroll file if not exists
if (!fs.existsSync(payrollPath)) {
  fs.writeFileSync(payrollPath, JSON.stringify([]));
}

// GET payroll
router.get("/", (req, res) => {
  const payroll = JSON.parse(fs.readFileSync(payrollPath));
  res.json(payroll);
});

// POST generate payroll
router.post("/generate", (req, res) => {
  const employees = JSON.parse(fs.readFileSync(employeesPath));
  const attendance = JSON.parse(fs.readFileSync(attendancePath));

  const payroll = employees.map(emp => {
    const empAttendance = attendance.flat().filter(
      a => a.employeeId == emp.id
    );

    const presentDays = empAttendance.filter(a => a.status === "Present").length;
    const totalDays = 30;
    const perDaySalary = emp.salary / totalDays;

    const deduction = (totalDays - presentDays) * perDaySalary;

    const totalSalary =
      emp.salary +
      emp.transport +
      emp.food +
      emp.stay -
      deduction;

    return {
      employeeId: emp.id,
      name: emp.name,
      presentDays,
      basicSalary: emp.salary,
      deduction: Math.round(deduction),
      allowances: emp.transport + emp.food + emp.stay,
      netSalary: Math.round(totalSalary)
    };
  });

  fs.writeFileSync(payrollPath, JSON.stringify(payroll, null, 2));
  res.json(payroll);
});

module.exports = router;
