const express = require("express");
const cors = require("cors");
const path = require("path");

const employeeRoutes = require("./routes/employees");
const attendanceRoutes = require("./routes/attendance");
const payrollRoutes = require("./routes/payroll");
const payslipRoutes = require("./routes/payslip");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(cors());
app.use(express.json());

// serve uploads if any
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payroll", payrollRoutes);   // 🔴 REQUIRED
app.use("/api/payslip", payslipRoutes);   // 🔴 REQUIRED
app.use("/api/dashboard", dashboardRoutes);


app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
