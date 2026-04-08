import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setError('');
      const response = await axios.get('/api/todos');
      setTodos(response.data);
    } catch (err) {
      setError('TODOの取得に失敗しました');
      console.error(err);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.post('/api/todos', {
        title: title.trim(),
        description: description.trim() || undefined
      });
      setTodos([...todos, response.data]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('TODOの追加に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      setError('');
      const response = await axios.patch(`/api/todos/${id}`, {
        completed: !completed
      });
      setTodos(todos.map(t => t.id === id ? response.data : t));
    } catch (err) {
      setError('TODOの更新に失敗しました');
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      setError('');
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError('TODOの削除に失敗しました');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Kindle TODO</h1>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleAddTodo} className="form">
        <input
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <textarea
          placeholder="説明（オプション）"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? '追加中...' : '追加'}
        </button>
      </form>

      <div className="todos">
        {todos.length === 0 ? (
          <p className="empty">TODOはまだありません</p>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className={`todo ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id, todo.completed)}
              />
              <div className="content">
                <h3>{todo.title}</h3>
                {todo.description && <p>{todo.description}</p>}
              </div>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="delete-btn"
              >
                削除
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
