const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Path to attendance JSON
const jsonPath = path.join(__dirname, "../data/attendance.json");

// Load existing attendance or empty array
let attendance = [];
if (fs.existsSync(jsonPath)) {
  attendance = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
}

// -------------------------
// GET all attendance
// -------------------------
router.get("/", (req, res) => {
  res.json(attendance);
});

// -------------------------
// POST attendance (array)
// -------------------------
router.post("/", (req, res) => {
  const records = req.body;

  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ error: "Attendance array required" });
  }

  records.forEach(record => {
    // Validate required fields
    if (!record.empId || !record.date || !record.status) return;

    // Check if record for same emp & date exists
    const existingIndex = attendance.findIndex(
      a => a.empId === record.empId && a.date === record.date
    );

    if (existingIndex !== -1) {
      // Update existing
      attendance[existingIndex] = record;
    } else {
      // Add new
      attendance.push(record);
    }
  });

  // Save JSON
  fs.writeFileSync(jsonPath, JSON.stringify(attendance, null, 2));

  res.json({ message: "Attendance saved successfully", savedCount: records.length });
});

module.exports = router;
