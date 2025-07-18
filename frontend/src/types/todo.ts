export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  getAuthToken?: () => string | undefined;
}

export interface TodoContextType {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  filter: 'all' | 'pending' | 'completed';
  setFilter: (filter: 'all' | 'pending' | 'completed') => void;
  filteredTodos: Todo[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  paginatedTodos: Todo[];
}

export type FilterType = 'all' | 'pending' | 'completed';