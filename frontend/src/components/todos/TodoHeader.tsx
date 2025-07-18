import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTodos } from '@/contexts/TodoContext';
import { AddTodoDialog } from './AddTodoDialog';
import { Plus, LogOut, User } from 'lucide-react';

export const TodoHeader: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { user, logout } = useAuth();
  const { todos } = useTodos();

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-card rounded-lg border">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            You have {totalCount - completedCount} pending todos out of {totalCount} total
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Todo
          </Button>
          
          <Button
            variant="outline"
            onClick={logout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
      
      <AddTodoDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
    </>
  );
};