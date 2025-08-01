require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const APIError = require('./utilities/APIError'); 

app.use(express.json());
app.use(express.static('public'));

const greetRouter = require('./routes/greet');

app.use('/greet', greetRouter);

const tasks = [];

const loggingEnabled = process.env.LOGGING_ENABLED === 'true';

const loggerGreet = (req,res,next) => {
  if (loggingEnabled && req.path.startsWith('/greet')) {
    const timeStamp = new Date().toISOString();
    console.log(`[${timeStamp}] ${req.method} ${req.originalUrl}`);
  }
next();
};

app.use(loggerGreet);

app.get('/', (req, res) => {
  res.send('Welcome to the Express.js Warm-up!');
});

app.get('/greet/:name', (req, res) => {
  const name = req.params.name;
  res.send(`Hello, ${name}!`);
});

app.get('/search', (req, res) => {
  const { q, limit } = req.query;
  if (limit && (!Number.isInteger(Number(limit)) || Number(limit) <= 0)) {
    return res.status(400).json({ error: 'Limit must be a positive integer' });
  }

  if (!q && !limit) {
    return res.json({ message: 'No search query provided' });
  }

  res.json({
    query: q,
    limit: limit ? Number(limit) : undefined,
    message: `Searching for ${q || 'items'} with a limit of ${limit || 'Default'} results`,
  });
});



app.post('/welcome', (req, res) => {
  const { name } = req.body;


  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  res.json({ message: `Welcome, ${name}!` });
});

app.post('/task', (req, res) => {
  const {title} = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and must be a string' });
  }
  const newTask = {
    id: tasks.length + 1,
    title: title.trim(),
  }

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  };
  res.json(task);
});


app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title } = req.body;
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and must be a string' });
  }
  task.title = title.trim();
  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted successfully' });
})

app.use((req, res) => {
  res.status(404).send('404 - not found');
});

app.use((err, req, res, next) => {
  if (err instanceof APIError) {  
    console.error(`[APIError] ${err.status} - ${err.message}`);
    return res.status(err.status).json({ error: err.message });
  } 
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error] ${err.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  });






app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Mode: ${process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}`);
});


