const express = require("express");
const router = express.Router();

// -------------------------
// In-memory employees store
// -------------------------
let employees = [
  // Example:
  // {
  //   id: 1769414556467,
  //   name: "Lokhitha",
  //   fatherName: "Mathan",
  //   dob: "2002-06-06",
  //   gender: "Male",
  //   originCountry: "India",
  //   email: "lokhitha@example.com",
  //   contact: "1234567890",
  //   residentialAddress: "123 Street, City",
  //   designation: "Developer",
  //   department: "IT",
  //   doj: "2025-01-01",
  //   status: "Active",
  //   passportNumber: "P1234567",
  //   visaNumber: "V1234567",
  //   photo: null,
  //   passportCopy: null,
  //   visaCopy: null,
  //   contract: null,
  //   salary: 5000,
  //   transport: 300,
  //   food: 200,
  //   stay: 500,
  //   overtimeEligible: "No",
  //   overtimeHours: 0,
  //   airticketEligible: "No",
  //   incentiveEligible: "No"
  // }
];

// -------------------------
// GET all employees
// -------------------------
router.get("/", (req, res) => {
  res.json(employees);
});

// -------------------------
// GET single employee by ID
// -------------------------
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const emp = employees.find(e => e.id === id);
  if (!emp) return res.status(404).json({ error: "Employee not found" });
  res.json(emp);
});

// -------------------------
// POST new employee
// -------------------------
router.post("/", (req, res) => {
  const data = req.body;

  if (!data.name || !data.department) {
    return res.status(400).json({ error: "Name and Department are required" });
  }

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
    designation: data.designation || "",
    department: data.department,
    doj: data.doj || "",
    status: data.status || "Active",
    passportNumber: data.passportNumber || "",
    visaNumber: data.visaNumber || "",
    photo: data.photo || null,
    passportCopy: data.passportCopy || null,
    visaCopy: data.visaCopy || null,
    contract: data.contract || null,
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
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const emp = employees.find(e => e.id === id);
  if (!emp) return res.status(404).json({ error: "Employee not found" });

  const data = req.body;

  Object.keys(data).forEach(key => {
    emp[key] = data[key];
  });

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
