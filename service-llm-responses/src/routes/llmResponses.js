const express = require('express');
const router = express.Router();

// Simple GET route to fetch all responses
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'List of responses (no logic yet)',
  });
  i;
});

module.exports = router;
