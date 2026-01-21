const express = require("express");
const router = express.Router();

// Placeholder route
router.get("/", (req, res) => {
  res.json({ message: "Payroll API works!" });
});

module.exports = router;
