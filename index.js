const express = require('express');
const app = express();
const port = 8000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Express.js Warm-up!');
});

app.get('/greet/:name', (req, res) => {
    const name = req.params.name;
    res.send(`Hello, ${name}!`);
})

app.use(express.json());

app.post('/welcome', (req, res) => {
  const { name } = req.body;

  // 🔍 Bonus: Make sure name is a non-empty string
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  res.json({ message: `Welcome, ${name}!` });
});

app.use((req, res) => {
  res.status(404).send('404 - not found');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

