import { Request, Response } from 'express';
import { Pool } from 'mysql2/promise';
import { TodoService } from '../services/TodoService';
import { CreateTodoRequest, UpdateTodoRequest } from '../model/Todo';

export class TodoController {
    private todoService: TodoService;

    constructor(db: Pool) {
        this.todoService = new TodoService(db);
    }

    createTodo = async (req: Request, res: Response): Promise<void> => {
        try {
            const todoData: CreateTodoRequest = req.body;
            const userId = (req as any).user.id; // From auth middleware

            // Basic validation
            if (!todoData.title) {
                res.status(400).json({
                    success: false,
                    message: 'Title is required'
                });
                return;
            }

            // Validate due_date format if provided
            if (todoData.due_date) {
                const dueDate = new Date(todoData.due_date);
                if (isNaN(dueDate.getTime())) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid due date format'
                    });
                    return;
                }
            }

            const result = await this.todoService.createTodo(userId, todoData);

            res.status(201).json({
                success: true,
                message: 'Todo created successfully',
                data: result
            });
        } catch (error) {
            console.error('Create todo error:', error);
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to create todo'
            });
        }
    };

    getTodos = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.id; // From auth middleware

            const todos = await this.todoService.findTodosByUserId(userId);

            res.status(200).json({
                success: true,
                message: 'Todos retrieved successfully',
                data: todos
            });
        } catch (error) {
            console.error('Get todos error:', error);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to retrieve todos'
            });
        }
    };

    getTodoById = async (req: Request, res: Response): Promise<void> => {
        try {
            const todoId = parseInt(req.params.id);
            const userId = (req as any).user.id; // From auth middleware

            if (isNaN(todoId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid todo ID'
                });
                return;
            }

            const todo = await this.todoService.findTodoById(todoId);

            if (!todo || todo.user_id !== userId) {
                res.status(404).json({
                    success: false,
                    message: 'Todo not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Todo retrieved successfully',
                data: todo
            });
        } catch (error) {
            console.error('Get todo error:', error);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to retrieve todo'
            });
        }
    };

    updateTodo = async (req: Request, res: Response): Promise<void> => {
        try {
            const todoId = parseInt(req.params.id);
            const userId = (req as any).user.id; // From auth middleware
            const updateData: UpdateTodoRequest = req.body;

            if (isNaN(todoId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid todo ID'
                });
                return;
            }

            // Validate due_date format if provided
            if (updateData.due_date) {
                const dueDate = new Date(updateData.due_date);
                if (isNaN(dueDate.getTime())) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid due date format'
                    });
                    return;
                }
            }

            const result = await this.todoService.updateTodo(todoId, userId, updateData);

            res.status(200).json({
                success: true,
                message: 'Todo updated successfully',
                data: result
            });
        } catch (error) {
            console.error('Update todo error:', error);
            const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update todo'
            });
        }
    };

    deleteTodo = async (req: Request, res: Response): Promise<void> => {
        try {
            const todoId = parseInt(req.params.id);
            const userId = (req as any).user.id; // From auth middleware

            if (isNaN(todoId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid todo ID'
                });
                return;
            }

            await this.todoService.deleteTodo(todoId, userId);

            res.status(200).json({
                success: true,
                message: 'Todo deleted successfully'
            });
        } catch (error) {
            console.error('Delete todo error:', error);
            const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to delete todo'
            });
        }
    };
}