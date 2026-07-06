import { ITaskRepository } from "./types";
import { Task, CreateTaskInput, UpdateTaskInput } from "../types/task";
import { supabase } from "../supabase/client";

export class SupabaseTaskRepository implements ITaskRepository {
  async getAll(): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }
    return data as Task[];
  }

  async getById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch task: ${error.message}`);
    }
    return data as Task | null;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User must be authenticated to create tasks.");
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title: input.title,
        description: input.description ?? null,
        completed: input.completed ?? false,
        priority: input.priority ?? "medium",
        category: input.category ?? null,
        due_date: input.due_date ?? null,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
    return data as Task;
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }
    return data as Task;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }

  async toggleComplete(id: string, completed: boolean): Promise<Task> {
    return this.update(id, { completed });
  }
}
