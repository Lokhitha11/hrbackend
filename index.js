const express = require("express");
const cors = require("cors");
const path = require("path");

const employeeRoutes = require("./routes/employees");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve uploaded files publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API routes
app.use("/api/employees", employeeRoutes);

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
