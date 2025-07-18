import React from 'react';
import { useTodos } from '@/contexts/TodoContext';
import { TodoItem } from './TodoItem';
import { TodoPagination } from './TodoPagination';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export const TodoList: React.FC = () => {
  const { paginatedTodos, filteredTodos, filter } = useTodos();

  if (filteredTodos.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {filter === 'all' ? 'No todos yet' : 
             filter === 'pending' ? 'No pending todos' : 
             'No completed todos'}
          </h3>
          <p className="text-muted-foreground">
            {filter === 'all' ? 'Create your first todo to get started!' : 
             filter === 'pending' ? 'All your todos are completed!' : 
             'Complete some todos to see them here.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {paginatedTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
      
      <TodoPagination />
    </div>
  );
};