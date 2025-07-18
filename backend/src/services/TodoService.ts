import { Pool } from 'mysql2/promise';
import { Todo, TodoResponse, CreateTodoRequest, UpdateTodoRequest } from '../model/Todo';

export class TodoService {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async createTodo(userId: number, todoData: CreateTodoRequest): Promise<TodoResponse> {
        const { title, description, due_date } = todoData;

        const [result] = await this.db.execute(
            'INSERT INTO todos (user_id, title, description, due_date) VALUES (?, ?, ?, ?)',
            [userId, title, description || null, due_date ? new Date(due_date) : null]
        );

        const insertId = (result as any).insertId;
        const newTodo = await this.findTodoById(insertId);
        
        if (!newTodo) {
            throw new Error('Failed to create todo');
        }

        return newTodo;
    }

    async findTodoById(id: number): Promise<TodoResponse | null> {
        const [rows] = await this.db.execute(
            'SELECT * FROM todos WHERE id = ?',
            [id]
        );

        const todos = rows as Todo[];
        return todos.length > 0 ? todos[0] as TodoResponse : null;
    }

    async findTodosByUserId(userId: number): Promise<TodoResponse[]> {
        const [rows] = await this.db.execute(
            'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        return rows as TodoResponse[];
    }

    async updateTodo(todoId: number, userId: number, updateData: UpdateTodoRequest): Promise<TodoResponse> {
        // First check if the todo exists and belongs to the user
        const existingTodo = await this.findTodoById(todoId);
        if (!existingTodo || existingTodo.user_id !== userId) {
            throw new Error('Todo not found or unauthorized');
        }

        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (updateData.title !== undefined) {
            updateFields.push('title = ?');
            updateValues.push(updateData.title);
        }

        if (updateData.description !== undefined) {
            updateFields.push('description = ?');
            updateValues.push(updateData.description);
        }

        if (updateData.due_date !== undefined) {
            updateFields.push('due_date = ?');
            updateValues.push(updateData.due_date ? new Date(updateData.due_date) : null);
        }

        if (updateData.completed !== undefined) {
            updateFields.push('completed = ?');
            updateValues.push(updateData.completed);
        }

        if (updateFields.length === 0) {
            throw new Error('No fields to update');
        }

        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(todoId);

        await this.db.execute(
            `UPDATE todos SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );

        const updatedTodo = await this.findTodoById(todoId);
        if (!updatedTodo) {
            throw new Error('Failed to update todo');
        }

        return updatedTodo;
    }

    async deleteTodo(todoId: number, userId: number): Promise<void> {
        // First check if the todo exists and belongs to the user
        const existingTodo = await this.findTodoById(todoId);
        if (!existingTodo || existingTodo.user_id !== userId) {
            throw new Error('Todo not found or unauthorized');
        }

        await this.db.execute(
            'DELETE FROM todos WHERE id = ? AND user_id = ?',
            [todoId, userId]
        );
    }
}