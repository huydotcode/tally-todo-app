import { ITaskRepository } from "./types";
import { Task, CreateTaskInput, UpdateTaskInput } from "../types/task";

const LOCAL_STORAGE_KEY = "tally_tasks";

export class LocalStorageTaskRepository implements ITaskRepository {
  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  private getTasks(): Task[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse localStorage tasks, returning empty list:", e);
      return [];
    }
  }

  private saveTasks(tasks: Task[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks to localStorage:", e);
    }
  }

  private generateUUID(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  async getAll(): Promise<Task[]> {
    return this.getTasks();
  }

  async getById(id: string): Promise<Task | null> {
    const tasks = this.getTasks();
    const task = tasks.find((t) => t.id === id);
    return task || null;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const tasks = this.getTasks();
    const now = new Date().toISOString();
    const newTask: Task = {
      id: this.generateUUID(),
      user_id: null,
      title: input.title,
      description: input.description ?? null,
      completed: input.completed ?? false,
      priority: input.priority ?? "medium",
      category: input.category ?? null,
      due_date: input.due_date ?? null,
      created_at: now,
      updated_at: now,
    };
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Task with ID ${id} not found.`);
    }

    const existingTask = tasks[index];
    const updatedTask: Task = {
      ...existingTask,
      ...input,
      description: input.description === undefined ? existingTask.description : (input.description ?? null),
      category: input.category === undefined ? existingTask.category : (input.category ?? null),
      due_date: input.due_date === undefined ? existingTask.due_date : (input.due_date ?? null),
      updated_at: new Date().toISOString(),
    };

    tasks[index] = updatedTask;
    this.saveTasks(tasks);
    return updatedTask;
  }

  async delete(id: string): Promise<void> {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter((t) => t.id !== id);
    this.saveTasks(filteredTasks);
  }

  async toggleComplete(id: string, completed: boolean): Promise<Task> {
    return this.update(id, { completed });
  }
}
