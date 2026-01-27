const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// -------------------------
// File storage setup
// -------------------------
const storage = multer.memoryStorage(); // store in memory, can later save to disk or DB
const upload = multer({ storage: storage });

// -------------------------
// In-memory employees store
// -------------------------
let employees = [];

// -------------------------
// GET all employees
// -------------------------
router.get("/", (req, res) => {
  res.json(employees);
});

// -------------------------
// GET single employee
// -------------------------
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const emp = employees.find(e => e.id === id);
  if (!emp) return res.status(404).json({ error: "Employee not found" });
  res.json(emp);
});

// -------------------------
// POST new employee with file uploads
// -------------------------
router.post("/", upload.fields([
  { name: "empPhoto" },
  { name: "empContract" },
  { name: "passportCopy" },
  { name: "visaCopy" }
]), (req, res) => {
  const data = req.body;

  if (!data.name || !data.department) {
    return res.status(400).json({ error: "Name and Department are required" });
  }

  // Convert files to base64 for frontend preview
  const files = req.files;
  const empPhoto = files.empPhoto ? files.empPhoto[0].buffer.toString("base64") : null;
  const empContract = files.empContract ? files.empContract[0].buffer.toString("base64") : null;
  const passportCopy = files.passportCopy ? files.passportCopy[0].buffer.toString("base64") : null;
  const visaCopy = files.visaCopy ? files.visaCopy[0].buffer.toString("base64") : null;

  const newEmp = {
    id: Date.now(),
    name: data.name,
    fatherName: data.fatherName || "",
    dob: data.dob || "",
    gender: data.gender || "",
    originCountry: data.originCountry || "",
    email: data.email || "",
    contact: data.contact || "",
    residentialAddress: data.residentialAddress || "",
    permanentAddress: data.permanentAddress || "",
    designation: data.designation || "",
    department: data.department,
    doj: data.doj || "",
    status: data.status || "Active",
    passportNumber: data.passportNumber || "",
    visaNumber: data.visaNumber || "",
    photo: empPhoto,
    contract: empContract,
    passportCopy: passportCopy,
    visaCopy: visaCopy,
    salary: data.salary || 0,
    transport: data.transport || 0,
    food: data.food || 0,
    stay: data.stay || 0,
    overtimeEligible: data.overtimeEligible || "No",
    overtimeHours: data.overtimeHours || 0,
    airticketEligible: data.airticketEligible || "No",
    incentiveEligible: data.incentiveEligible || "No"
  };

  employees.push(newEmp);
  res.status(201).json(newEmp);
});

// -------------------------
// PUT update employee
// -------------------------
router.put("/:id", upload.fields([
  { name: "empPhoto" },
  { name: "empContract" },
  { name: "passportCopy" },
  { name: "visaCopy" }
]), (req, res) => {
  const id = parseInt(req.params.id);
  const emp = employees.find(e => e.id === id);
  if (!emp) return res.status(404).json({ error: "Employee not found" });

  const data = req.body;
  const files = req.files;

  // Update regular fields
  Object.keys(data).forEach(key => {
    emp[key] = data[key];
  });

  // Update files if uploaded
  if (files.empPhoto) emp.photo = files.empPhoto[0].buffer.toString("base64");
  if (files.empContract) emp.contract = files.empContract[0].buffer.toString("base64");
  if (files.passportCopy) emp.passportCopy = files.passportCopy[0].buffer.toString("base64");
  if (files.visaCopy) emp.visaCopy = files.visaCopy[0].buffer.toString("base64");

  res.json(emp);
});

// -------------------------
// DELETE employee
// -------------------------
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = employees.findIndex(e => e.id === id);
  if (index === -1) return res.status(404).json({ error: "Employee not found" });

  const deleted = employees.splice(index, 1);
  res.json(deleted[0]);
});

module.exports = router;
