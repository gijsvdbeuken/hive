const express = require('express');
const router = express.Router();

// Simple GET route to merge responses
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Merging... (no logic yet)',
  });
  i;
});

module.exports = router;
