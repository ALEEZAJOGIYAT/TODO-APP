import express from 'express';
import { Pool } from 'mysql2/promise';
import { TodoController } from '../controller/TodoController';
import { authenticateToken } from '../middleware/auth';

export const createTodoRoutes = (db: Pool) => {
    const router = express.Router();
    const todoController = new TodoController(db);

    // authenticating all routes
    router.use(authenticateToken);

    router.post('/', todoController.createTodo);
    router.get('/', todoController.getTodos);
    router.get('/:id', todoController.getTodoById);
    router.put('/:id', todoController.updateTodo);
    router.delete('/:id', todoController.deleteTodo);

    return router;
};