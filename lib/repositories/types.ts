import { Task, CreateTaskInput, UpdateTaskInput } from "../types/task";

export interface ITaskRepository {
  getAll(): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  create(input: CreateTaskInput): Promise<Task>;
  update(id: string, input: UpdateTaskInput): Promise<Task>;
  delete(id: string): Promise<void>;
  toggleComplete(id: string, completed: boolean): Promise<Task>;
}
