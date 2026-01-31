const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Paths to JSON files
const EMP_JSON = path.join(__dirname, "../data/employees.json");
const ATT_JSON = path.join(__dirname, "../data/attendance.json");

// -------------------------
// GET payroll
// -------------------------
router.get("/", (req, res) => {
  try {
    // Load latest employees & attendance from JSON
    let employees = [];
    if (fs.existsSync(EMP_JSON)) {
      employees = JSON.parse(fs.readFileSync(EMP_JSON, "utf-8"));
    }

    let attendance = [];
    if (fs.existsSync(ATT_JSON)) {
      attendance = JSON.parse(fs.readFileSync(ATT_JSON, "utf-8"));
    }

    const payroll = employees.map(emp => {
      const empAttendance = attendance.filter(a => a.empId === emp.id);

      let absentDays = 0;
      let overtimeAmount = 0;

      const basicSalary = Number(emp.salary || 0);
      const perHourSalary = basicSalary / 30 / 10; // Monthly / 30 days / 10 hours/day

      empAttendance.forEach(a => {
        // Count absent days
        if (a.status === "Absent") absentDays++;

        // Calculate overtime
        const otHours = Number(a.overtimeHours || 0);
        const dayType = (a.dayType || "Weekday").toLowerCase();

        if (otHours > 0) {
          if (dayType === "sunday") {
            overtimeAmount += otHours * perHourSalary * 1.5;
          } else {
            overtimeAmount += otHours * perHourSalary * 1.25;
          }
        }
      });

      const perDaySalary = basicSalary / 30;
      const absentDeduction = absentDays * perDaySalary;
      const finalSalary = basicSalary - absentDeduction + overtimeAmount;

      return {
        empId: emp.id,
        name: emp.name,
        basicSalary: basicSalary.toFixed(2),
        absentDays,
        absentDeduction: absentDeduction.toFixed(2),
        overtimeAmount: overtimeAmount.toFixed(2),
        finalSalary: finalSalary.toFixed(2)
      };
    });

    res.json(payroll);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate payroll", details: err.message });
  }
});

module.exports = router;
