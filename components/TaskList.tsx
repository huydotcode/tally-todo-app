"use client";

import React, { forwardRef } from "react";
import { Task } from "../lib/types/task";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskList = forwardRef<HTMLDivElement, TaskListProps>(
  ({ tasks, onToggle, onEdit, onDelete }, ref) => {
    return (
      <div id="task-list-container" className="task-list" ref={ref}>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }
);

TaskList.displayName = "TaskList";
