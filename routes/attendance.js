const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// JSON file to store attendance
const jsonPath = path.join(__dirname, "../data/attendance.json");

// Load existing attendance
let attendanceRecords = [];
if (fs.existsSync(jsonPath)) {
  attendanceRecords = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
}

// -------------------------
// GET all attendance records
// -------------------------
router.get("/", (req, res) => {
  res.json(attendanceRecords);
});

// -------------------------
// POST attendance records
// -------------------------
router.post("/", (req, res) => {
  try {
    const records = req.body;

    if (!Array.isArray(records)) {
      return res.status(400).json({ error: "Invalid attendance data" });
    }

    // Add a timestamp for each record
    const timestamp = new Date().toISOString();
    records.forEach(r => r.date = timestamp);

    // Save to in-memory array
    attendanceRecords.push(...records);

    // Save to JSON file
    fs.writeFileSync(jsonPath, JSON.stringify(attendanceRecords, null, 2));

    res.status(201).json({ message: "Attendance saved successfully", data: records });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

module.exports = router;
