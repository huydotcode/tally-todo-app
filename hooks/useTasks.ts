import { useEffect, useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { Task, CreateTaskInput, UpdateTaskInput } from "../lib/types/task";
import { RepositoryFactory } from "../lib/repositories/repositoryFactory";
import { TaskService } from "../lib/services/taskService";

export function useTasks(user: User | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    setError(null);
    try {
      const repo = await RepositoryFactory.getRepository();
      const service = new TaskService(repo);
      const data = await service.getAllTasks();
      setTasks(data);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Không thể tải danh sách công việc.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [user, loadTasks]);

  const addTask = async (input: CreateTaskInput) => {
    setError(null);
    setWarning(null);
    try {
      const repo = await RepositoryFactory.getRepository();
      const service = new TaskService(repo);
      const { task, warning: warn } = await service.createTask(input);
      setTasks((prev) => [...prev, task]);
      if (warn) setWarning(warn);
      return { task, warning: warn };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Không thể thêm công việc.";
      setError(errMsg);
      throw err;
    }
  };

  const editTask = async (id: string, input: UpdateTaskInput) => {
    setError(null);
    setWarning(null);
    try {
      const repo = await RepositoryFactory.getRepository();
      const service = new TaskService(repo);
      const { task, warning: warn } = await service.updateTask(id, input);
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
      if (warn) setWarning(warn);
      return { task, warning: warn };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Không thể cập nhật công việc.";
      setError(errMsg);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    setError(null);
    try {
      const repo = await RepositoryFactory.getRepository();
      const service = new TaskService(repo);
      await service.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Không thể xóa công việc.";
      setError(errMsg);
      throw err;
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    setError(null);
    const originalTasks = [...tasks];

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed, updated_at: new Date().toISOString() }
          : t
      )
    );

    try {
      const repo = await RepositoryFactory.getRepository();
      const service = new TaskService(repo);
      const updatedTask = await service.toggleTaskComplete(id, completed);
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      return updatedTask;
    } catch (err: unknown) {
      // Rollback on error
      setTasks(originalTasks);
      const errMsg = err instanceof Error ? err.message : "Không thể cập nhật trạng thái công việc.";
      setError(errMsg);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    warning,
    addTask,
    editTask,
    deleteTask,
    toggleTask,
    refreshTasks: loadTasks,
    setWarning,
    setError,
  };
}

