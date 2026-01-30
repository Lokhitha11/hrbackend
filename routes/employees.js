const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

/* ================================
   FILE STORAGE CONFIG
================================ */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ================================
   JSON STORAGE
================================ */
const jsonPath = path.join(__dirname, "../data/employees.json");

let employees = [];
if (fs.existsSync(jsonPath)) {
  employees = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
}

/* ================================
   HELPERS
================================ */
const getFileUrl = (req, name) => {
  const file = req.files?.find(f => f.fieldname === name);
  return file ? `/uploads/${file.filename}` : null;
};

/* ================================
   GET ALL EMPLOYEES
================================ */
router.get("/", (req, res) => {
  res.json(employees);
});

/* ================================
   GET SINGLE EMPLOYEE
================================ */
router.get("/:id", (req, res) => {
  const emp = employees.find(e => e.id == req.params.id);
  if (!emp) return res.status(404).json({ error: "Employee not found" });
  res.json(emp);
});

/* ================================
   ADD EMPLOYEE
================================ */
router.post("/", upload.any(), (req, res) => {
  try {
    const d = req.body;

    if (!d.name || !d.department) {
      return res.status(400).json({ error: "Name & Department required" });
    }

    const emp = {
      id: Date.now(),
      name: d.name,
      department: d.department,
      designation: d.designation || "",
      status: d.status || "Active",

      fatherName: d.fatherName || "",
      dob: d.dob || "",
      gender: d.gender || "",
      originCountry: d.originCountry || "",
      email: d.email || "",
      contact: d.contact || "",
      residentialAddress: d.residentialAddress || "",

      doj: d.doj || "",

      passportNumber: d.passportNumber || "",
      visaNumber: d.visaNumber || "",

      salary: Number(d.salary) || 0,
      transport: Number(d.transport) || 0,
      food: Number(d.food) || 0,
      stay: Number(d.stay) || 0,

      overtimeEligible: d.overtimeEligible || "No",
      overtimeHours: Number(d.overtimeHours) || 0,
      airticketEligible: d.airticketEligible || "No",
      incentiveEligible: d.incentiveEligible || "No",

      // ✅ FILE URLS (PUBLIC)
      empPhoto: getFileUrl(req, "empPhoto"),
      passportCopy: getFileUrl(req, "passportCopy"),
      visaCopy: getFileUrl(req, "visaCopy"),
      contract: getFileUrl(req, "empContract")
    };

    employees.push(emp);
    fs.writeFileSync(jsonPath, JSON.stringify(employees, null, 2));

    res.status(201).json(emp);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ================================
   UPDATE EMPLOYEE
================================ */
router.put("/:id", (req, res) => {
  const emp = employees.find(e => e.id == req.params.id);
  if (!emp) return res.status(404).json({ error: "Employee not found" });

  Object.assign(emp, req.body);
  fs.writeFileSync(jsonPath, JSON.stringify(employees, null, 2));

  res.json(emp);
});

/* ================================
   DELETE EMPLOYEE
================================ */
router.delete("/:id", (req, res) => {
  employees = employees.filter(e => e.id != req.params.id);
  fs.writeFileSync(jsonPath, JSON.stringify(employees, null, 2));
  res.json({ success: true });
});

module.exports = router;
