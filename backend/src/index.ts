import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

let todos: Todo[] = [];

// GET all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// POST create todo
app.post('/api/todos', (req, res) => {
  const { title, description } = req.body;
  
  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  const todo: Todo = {
    id: uuidv4(),
    title,
    description: description || undefined,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  todos.push(todo);
  res.status(201).json(todo);
});

// PATCH update todo
app.patch('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  const todo = todos.find(t => t.id === id);
  if (!todo) {
    res.status(404).json({ error: 'Todo not found' });
    return;
  }

  if (title !== undefined) todo.title = title;
  if (description !== undefined) todo.description = description;
  if (completed !== undefined) todo.completed = completed;
  todo.updatedAt = new Date().toISOString();

  res.json(todo);
});

// DELETE todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Todo not found' });
    return;
  }

  const [deleted] = todos.splice(index, 1);
  res.json(deleted);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
