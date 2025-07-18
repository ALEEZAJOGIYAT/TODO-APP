import { Todo, User } from '@/types/todo';

const STORAGE_KEYS = {
  TODOS: 'todos',
  USERS: 'users',
  CURRENT_USER: 'currentUser',
} as const;

// Todo storage functions
export const saveTodos = (todos: Todo[]): void => {
  localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
};

export const getTodos = (): Todo[] => {
  const todos = localStorage.getItem(STORAGE_KEYS.TODOS);
  return todos ? JSON.parse(todos) : [];
};

// User storage functions
export const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const saveCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Date utilities
export const isToday = (date: string): boolean => {
  const today = new Date();
  const todoDate = new Date(date);
  return (
    todoDate.getDate() === today.getDate() &&
    todoDate.getMonth() === today.getMonth() &&
    todoDate.getFullYear() === today.getFullYear()
  );
};

export const isOverdue = (date: string): boolean => {
  const today = new Date();
  const todoDate = new Date(date);
  return todoDate < today && !isToday(date);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};