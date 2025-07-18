import React from 'react';
import { TodoHeader } from './TodoHeader';
import { TodoFilters } from './TodoFilters';
import { TodoList } from './TodoList';
import { TodoProvider } from '@/contexts/TodoContext';

export const TodoApp: React.FC = () => {
  return (
    <TodoProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-card">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            <TodoHeader />
            <TodoFilters />
            <TodoList />
          </div>
        </div>
      </div>
    </TodoProvider>
  );
};