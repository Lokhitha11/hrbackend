const express = require("express");
const router = express.Router();

// Placeholder route
router.get("/", (req, res) => {
  res.json({ message: "Employees API works!" });
});

module.exports = router;
