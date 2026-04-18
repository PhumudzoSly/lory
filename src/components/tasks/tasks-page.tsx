import { useState } from 'react';
import { useQuery } from 'convex/react';
import { IconChecklist } from '@tabler/icons-react';
import { api } from '../../../convex/_generated/api';
import { TaskList } from './task-list';
import { CreateTaskDialog } from './create-task-dialog';
import { FilterTasksPopover } from './filter-tasks-popover';

export const TasksPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const tasks = useQuery(api.tasks.list, { searchQuery: searchQuery || undefined });

  const todoTasks = tasks?.filter((t) => t.status === 'todo') || [];
  const inProgressTasks = tasks?.filter((t) => t.status === 'in_progress') || [];
  const doneTasks = tasks?.filter((t) => t.status === 'done') || [];

  const todayDateString = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto space-y-10 py-6 px-4">
      {/* Header: Minimal, tracking-widest, subtle hover */}
      <header className="space-y-6">
        <div className="flex w-fit items-center gap-2 border-b border-transparent pb-0.5 text-muted-foreground/30 transition-colors group hover:border-border/40 cursor-default">
          <IconChecklist
            size={11}
            stroke={2.5}
            className="transition-colors group-hover:text-foreground/50"
          />
          <span className="text-[12px] font-bold uppercase tracking-[0.3em] transition-colors group-hover:text-foreground/50">
            {todayDateString}
          </span>
        </div>

        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground/80">
              Tasks
            </h1>
            <p className="max-w-2xl text-[13px] font-normal leading-relaxed text-muted-foreground/60">
              Manage your daily tasks and maintain focus across multiple projects.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FilterTasksPopover searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <CreateTaskDialog />
          </div>
        </div>
      </header>

      {/* Tasks Lists Grouped by Status */}
      <div className="space-y-10">
        <div className="max-w-2xl">
          <TaskList 
            tasks={todoTasks} 
            title="To Do" 
            description="Your pending tasks"
          />
        </div>

        {inProgressTasks.length > 0 && (
          <div className="max-w-2xl">
            <TaskList 
              tasks={inProgressTasks} 
              title="In Progress" 
              description="Currently working on"
            />
          </div>
        )}

        {doneTasks.length > 0 && (
          <div className="max-w-2xl opacity-60 transition-opacity hover:opacity-100">
            <TaskList 
              tasks={doneTasks} 
              title="Completed" 
              description="Tasks finished"
            />
          </div>
        )}
      </div>
    </div>
  );
};
