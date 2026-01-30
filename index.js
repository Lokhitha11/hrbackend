const express = require("express");
const cors = require("cors");
const path = require("path");

const employeeRoutes = require("./routes/employees");
const attendanceRoutes = require("./routes/attendance");
const payrollRoutes = require("./routes/payroll");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payroll", payrollRoutes);


console.log("Employee route loaded ✅");
console.log("Attendance route loaded ✅");


app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
