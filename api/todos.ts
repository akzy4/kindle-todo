import { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 as uuidv4 } from 'uuid';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// メモリ内ストア（実装のみ。本番では DB を使用）
let todos: Todo[] = [];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method, query, body } = req;
  const id = Array.isArray(query.id) ? query.id[0] : query.id;

  try {
    if (method === 'GET' && !id) {
      res.status(200).json(todos);
    } else if (method === 'POST') {
      if (!body.title) {
        res.status(400).json({ error: 'Title is required' });
        return;
      }
      const todo: Todo = {
        id: uuidv4(),
        title: body.title,
        description: body.description || undefined,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      todos.push(todo);
      res.status(201).json(todo);
    } else if (method === 'PATCH' && id) {
      const todo = todos.find(t => t.id === id);
      if (!todo) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }
      if (body.title !== undefined) todo.title = body.title;
      if (body.description !== undefined) todo.description = body.description;
      if (body.completed !== undefined) todo.completed = body.completed;
      todo.updatedAt = new Date().toISOString();
      res.status(200).json(todo);
    } else if (method === 'DELETE' && id) {
      const index = todos.findIndex(t => t.id === id);
      if (index === -1) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }
      const [deleted] = todos.splice(index, 1);
      res.status(200).json(deleted);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
