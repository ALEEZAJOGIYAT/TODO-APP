import React, { useState } from 'react';
import { Todo } from '@/types/todo';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useTodos } from '@/contexts/TodoContext';
import { isToday, isOverdue, formatDate } from '@/utils/storage';
import { Trash2, Edit2, Calendar, Clock } from 'lucide-react';
import { EditTodoDialog } from './EditTodoDialog';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toggleTodo, deleteTodo } = useTodos();

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const getDueDateBadge = () => {
    if (isOverdue(todo.dueDate)) {
      return (
        <Badge variant="destructive" className="text-xs">
          <Clock className="w-3 h-3 mr-1" />
          Overdue
        </Badge>
      );
    }
    
    if (isToday(todo.dueDate)) {
      return (
        <Badge variant="default" className="text-xs bg-warning text-warning-foreground">
          <Calendar className="w-3 h-3 mr-1" />
          Today
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="text-xs">
        <Calendar className="w-3 h-3 mr-1" />
        {formatDate(todo.dueDate)}
      </Badge>
    );
  };

  return (
    <>
      <Card className={`transition-all duration-300 hover:shadow-lg ${
        todo.completed ? 'opacity-70' : ''
      } ${isOverdue(todo.dueDate) && !todo.completed ? 'border-destructive' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={handleToggle}
              className="mt-1"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-medium truncate ${
                  todo.completed ? 'line-through text-muted-foreground' : ''
                }`}>
                  {todo.title}
                </h3>
                {getDueDateBadge()}
              </div>
              
              {todo.description && (
                <p className={`text-sm text-muted-foreground mb-2 ${
                  todo.completed ? 'line-through' : ''
                }`}>
                  {todo.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {todo.completed && (
                    <Badge variant="default" className="text-xs bg-success text-success-foreground">
                      Completed
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <EditTodoDialog
        todo={todo}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </>
  );
};