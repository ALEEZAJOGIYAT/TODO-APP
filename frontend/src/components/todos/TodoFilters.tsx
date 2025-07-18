import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTodos } from '@/contexts/TodoContext';
import { FilterType } from '@/types/todo';
import { Filter, CheckCircle, Clock, List } from 'lucide-react';

export const TodoFilters: React.FC = () => {
  const { filter, setFilter, todos } = useTodos();

  const getFilterCount = (filterType: FilterType) => {
    switch (filterType) {
      case 'completed':
        return todos.filter(todo => todo.completed).length;
      case 'pending':
        return todos.filter(todo => !todo.completed).length;
      default:
        return todos.length;
    }
  };

  const filters = [
    { value: 'all' as FilterType, label: 'All Tasks', icon: List },
    { value: 'pending' as FilterType, label: 'Pending', icon: Clock },
    { value: 'completed' as FilterType, label: 'Completed', icon: CheckCircle },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-card rounded-lg border">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 sm:mb-0">
        <Filter className="h-4 w-4" />
        <span>Filter by:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filters.map((filterOption) => {
          const Icon = filterOption.icon;
          const count = getFilterCount(filterOption.value);
          const isActive = filter === filterOption.value;
          
          return (
            <Button
              key={filterOption.value}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption.value)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {filterOption.label}
              <Badge 
                variant={isActive ? 'secondary' : 'outline'}
                className="ml-1 px-2 py-0.5 text-xs"
              >
                {count}
              </Badge>
            </Button>
          );
        })}
      </div>
    </div>
  );
};