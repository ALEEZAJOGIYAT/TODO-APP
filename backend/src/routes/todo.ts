import express from 'express';
import { Pool } from 'mysql2/promise';
import { TodoController } from '../controller/TodoController';
import { authenticateToken } from '../middleware/auth';

export const createTodoRoutes = (db: Pool) => {
    const router = express.Router();
    const todoController = new TodoController(db);

    // All todo routes require authentication
    router.use(authenticateToken);

    // POST /api/todos - Create a new todo
    router.post('/create', todoController.createTodo);

    // GET /api/todos - Get all todos for the authenticated user
    router.get('/list', todoController.getTodos);

    // GET /api/todos/:id - Get a specific todo by ID
    router.get('/:id', todoController.getTodoById);

    // PUT /api/todos/:id - Update a todo
    router.put('/:id', todoController.updateTodo);

    // DELETE /api/todos/:id - Delete a todo
    router.delete('/:id', todoController.deleteTodo);

    return router;
};