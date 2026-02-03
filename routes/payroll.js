const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const EMP_JSON = path.join(__dirname, "../data/employees.json");
const ATT_JSON = path.join(__dirname, "../data/attendance.json");
const LAST_PAYROLL_JSON = path.join(__dirname, "../data/lastPayroll.json");

router.get("/", (req, res) => {
  try {
    const month = Number(req.query.month); // 1-12
    const year = Number(req.query.year);

    if (!month || !year) {
      return res.status(400).json({ error: "Month and Year required" });
    }

    const employees = fs.existsSync(EMP_JSON)
      ? JSON.parse(fs.readFileSync(EMP_JSON, "utf-8"))
      : [];

    const attendance = fs.existsSync(ATT_JSON)
      ? JSON.parse(fs.readFileSync(ATT_JSON, "utf-8"))
      : [];

    const payroll = employees.map(emp => {
      const empAttendance = attendance.filter(a => {
        if (a.empId !== emp.id) return false;
        const d = new Date(a.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      });

      let absentDays = 0;
      let overtimeAmount = 0;

      const basicSalary = Number(emp.salary || 0);
      const perDaySalary = basicSalary / 30;
      const perHourSalary = perDaySalary / 10;

      empAttendance.forEach(a => {
        if (a.status === "Absent") absentDays++;

        const otHours = Number(a.overtimeHours || a.overtime || 0);
        const dayType = (a.dayType || "Weekday").toLowerCase();

        if (otHours > 0) {
          if (dayType === "sunday") {
            overtimeAmount += otHours * perHourSalary * 1.5;
          } else {
            overtimeAmount += otHours * perHourSalary * 1.25;
          }
        }
      });

      const absentDeduction = absentDays * perDaySalary;
      const finalSalary = basicSalary - absentDeduction + overtimeAmount;

      return {
        empId: emp.id,
        name: emp.name,
        month,
        year,
        basicSalary: basicSalary.toFixed(2),
        absentDays,
        absentDeduction: absentDeduction.toFixed(2),
        overtimeAmount: overtimeAmount.toFixed(2),
        finalSalary: finalSalary.toFixed(2)
      };
    });

    // ✅ SAVE payroll for payslip PDF
    fs.writeFileSync(
      LAST_PAYROLL_JSON,
      JSON.stringify(payroll, null, 2)
    );

    res.json(payroll);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
