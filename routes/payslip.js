const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const router = express.Router();
console.log("🟢 payslip route loaded");



const EMP_PATH = path.join(__dirname, "../data/employees.json");
const PAYROLL_PATH = path.join(__dirname, "../data/lastPayroll.json");

router.get("/:empId", (req, res) => {
  const { empId } = req.params;
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).send("Month and year required");
  }

  const employees = JSON.parse(fs.readFileSync(EMP_PATH, "utf-8"));
  const payroll = JSON.parse(fs.readFileSync(PAYROLL_PATH, "utf-8"));

  const emp = employees.find(e => e.id == empId);
  const pay = payroll.find(p => p.empId == empId);

  if (!emp || !pay) {
    return res.status(404).send("Payslip data not found");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=payslip-${emp.name}-${month}-${year}.pdf`
  );

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);

  // ===== PDF CONTENT =====
  doc.fontSize(18).text("PAYSLIP", { align: "center" });
  doc.moveDown();

  doc.fontSize(12);
  doc.text(`Employee Name: ${emp.name}`);
  doc.text(`Department: ${emp.department}`);
  doc.text(`Month / Year: ${month} / ${year}`);
  doc.moveDown();

  doc.text(`Basic Salary: ${pay.basicSalary}`);
  doc.text(`Overtime Amount: ${pay.overtimeAmount}`);
  doc.text(`Absent Deduction: ${pay.absentDeduction}`);
  doc.moveDown();

  doc.fontSize(14).text(`Net Salary: ${pay.finalSalary}`, {
    underline: true
  });

  doc.moveDown(3);
  doc.text("Employer Signature: ______________________");
  doc.text("Employee Signature: ______________________");

  doc.end();
});

module.exports = router;
