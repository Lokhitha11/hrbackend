const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import routes
const employeeRoutes = require("./routes/employees");
// const attendanceRoutes = require("./routes/attendance");
// const payrollRoutes = require("./routes/payroll");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/employees", employeeRoutes);
// app.use("/api/attendance", attendanceRoutes);
// app.use("/api/payroll", payrollRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
