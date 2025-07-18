export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    contact_no?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    contact_no?: string;
    created_at: Date;
    updated_at: Date;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
    contact_no?: string;
}

export interface AuthResponse {
    user: UserResponse;
    token: string;
}