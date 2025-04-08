const express = require("express");
const router = express.Router();

// Simple GET route to fetch all users
router.get("/", (req, res) => {
  res.status(200).json({
    message: "List of users (no logic yet)",
  });
  i;
});

// Simple POST route to create a new user
router.post("/", (req, res) => {
  const { username, email } = req.body;
  res.status(201).json({
    message: `User ${username} with email ${email} created (no logic yet)`,
  });
});

module.exports = router;
