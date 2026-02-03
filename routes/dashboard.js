const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const EMP_PATH = path.join(__dirname, "../data/employees.json");
const ATT_PATH = path.join(__dirname, "../data/attendance.json");

router.get("/summary", (req, res) => {
  const employees = fs.existsSync(EMP_PATH)
    ? JSON.parse(fs.readFileSync(EMP_PATH, "utf-8"))
    : [];

  const attendance = fs.existsSync(ATT_PATH)
    ? JSON.parse(fs.readFileSync(ATT_PATH, "utf-8"))
    : [];

  const today = new Date().toISOString().split("T")[0];

  res.json({
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === "Active").length,
    absentToday: attendance.filter(
      a => a.date === today && a.status === "Absent"
    ).length
  });
});

module.exports = router;
