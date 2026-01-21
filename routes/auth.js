const express = require("express");
const router = express.Router();

// Placeholder login
router.post("/login", (req, res) => {
  res.json({ success: true, user: { name: "Admin" } });
});

router.post("/logout", (req, res) => {
  res.json({ success: true });
});

router.get("/me", (req, res) => {
  res.json({ user: { name: "Admin" } });
});

module.exports = router;
