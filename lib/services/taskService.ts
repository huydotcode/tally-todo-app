import { ITaskRepository } from "../repositories/types";
import { Task, CreateTaskInput, UpdateTaskInput, CreateTaskInputSchema, UpdateTaskInputSchema } from "../types/task";

export class TaskService {
  constructor(private repository: ITaskRepository) {}

  static validateInput(input: CreateTaskInput | UpdateTaskInput, isUpdate = false) {
    if (isUpdate) {
      return UpdateTaskInputSchema.safeParse(input);
    }
    return CreateTaskInputSchema.safeParse(input);
  }

  static checkDueDateWarning(dueDate: string | null | undefined): string | null {
    if (!dueDate) return null;
    
    const parts = dueDate.split('-');
    if (parts.length !== 3) return null;
    
    const selectedDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    selectedDate.setHours(0, 0, 0, 0);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (selectedDate < now) {
      return "Hạn chót đang được đặt ở quá khứ.";
    }
    return null;
  }

  async getAllTasks(): Promise<Task[]> {
    return this.repository.getAll();
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.repository.getById(id);
  }

  async createTask(input: CreateTaskInput): Promise<{ task: Task; warning: string | null }> {
    const validation = TaskService.validateInput(input, false);
    if (!validation.success) {
      throw new Error(validation.error.issues[0].message);
    }

    const warning = TaskService.checkDueDateWarning(input.due_date);
    const task = await this.repository.create(validation.data as CreateTaskInput);
    return { task, warning };
  }

  async updateTask(id: string, input: UpdateTaskInput): Promise<{ task: Task; warning: string | null }> {
    const validation = TaskService.validateInput(input, true);
    if (!validation.success) {
      throw new Error(validation.error.issues[0].message);
    }

    const warning = TaskService.checkDueDateWarning(input.due_date);
    const task = await this.repository.update(id, validation.data as UpdateTaskInput);
    return { task, warning };
  }

  async deleteTask(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async toggleTaskComplete(id: string, completed: boolean): Promise<Task> {
    return this.repository.toggleComplete(id, completed);
  }

  // --- Client Side Search, Filter, Sort Logic ---

  static searchTasks(tasks: Task[], query: string): Task[] {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return tasks;
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(trimmed) ||
        (task.description && task.description.toLowerCase().includes(trimmed))
    );
  }

  static filterTasks(
    tasks: Task[],
    filters: { completed?: boolean; priority?: string; category?: string }
  ): Task[] {
    return tasks.filter((task) => {
      if (filters.completed !== undefined && task.completed !== filters.completed) {
        return false;
      }
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }
      if (filters.category) {
        if (filters.category === "none") {
          return !task.category;
        }
        return task.category === filters.category;
      }
      return true;
    });
  }

  static sortTasks(
    tasks: Task[],
    sortBy: "created_at" | "due_date" | "priority",
    order: "asc" | "desc" = "asc"
  ): Task[] {
    const isAsc = order === "asc";
    const priorityWeight = { high: 3, medium: 2, low: 1 };

    return [...tasks].sort((a, b) => {
      let valA: any = a[sortBy];
      let valB: any = b[sortBy];

      if (sortBy === "priority") {
        valA = priorityWeight[a.priority] || 0;
        valB = priorityWeight[b.priority] || 0;
      }

      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (valA < valB) return isAsc ? -1 : 1;
      if (valA > valB) return isAsc ? 1 : -1;
      return 0;
    });
  }
}
