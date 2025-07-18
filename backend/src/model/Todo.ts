export interface Todo {
    id?: number;
    user_id: number;
    title: string;
    description?: string;
    due_date?: Date;
    completed?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface TodoResponse {
    id: number;
    user_id: number;
    title: string;
    description?: string;
    due_date?: Date;
    completed: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface CreateTodoRequest {
    title: string;
    description?: string;
    due_date?: string; // ISO date string
}

export interface UpdateTodoRequest {
    title?: string;
    description?: string;
    due_date?: string;
    completed?: boolean;
}