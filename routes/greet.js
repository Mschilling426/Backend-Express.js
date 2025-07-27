const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.status(400).json({ error: 'Name is required' });
});

router.get('/:name', (req, res) => {
  const { name } = req.params;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  res.json({ message: `Hello, ${name}!` });
});

module.exports = router;