import { SupabaseTaskRepository } from "../repositories/supabaseTaskRepository";
import { Task } from "../types/task";

const LOCAL_STORAGE_KEY = "tally_tasks";
const MIGRATED_FLAG_KEY = "tally_tasks_migrated";

export async function migrateGuestTasks(): Promise<{ success: boolean; count: number; error?: string }> {
  if (typeof window === "undefined") {
    return { success: false, count: 0, error: "Migration can only run in browser environment." };
  }

  const alreadyMigrated = localStorage.getItem(MIGRATED_FLAG_KEY);
  if (alreadyMigrated === "true") {
    return { success: true, count: 0 };
  }

  const guestTasksStr = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!guestTasksStr) {
    localStorage.setItem(MIGRATED_FLAG_KEY, "true");
    return { success: true, count: 0 };
  }

  let guestTasks: Partial<Task>[] = [];
  try {
    guestTasks = JSON.parse(guestTasksStr);
    if (!Array.isArray(guestTasks)) {
      guestTasks = [];
    }
  } catch (e) {
    console.error("Failed to parse guest tasks for migration:", e);
    return { success: false, count: 0, error: "Failed to parse guest tasks." };
  }

  if (guestTasks.length === 0) {
    localStorage.setItem(MIGRATED_FLAG_KEY, "true");
    return { success: true, count: 0 };
  }

  const supabaseRepo = new SupabaseTaskRepository();
  const migratedTasks: Task[] = [];

  try {
    for (const task of guestTasks) {
      if (!task.title) continue;
      const created = await supabaseRepo.create({
        title: task.title,
        description: task.description || null,
        completed: task.completed || false,
        priority: task.priority || "medium",
        category: task.category || null,
        due_date: task.due_date || null,
      });
      migratedTasks.push(created);
    }

    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.setItem(MIGRATED_FLAG_KEY, "true");

    return { success: true, count: migratedTasks.length };
  } catch (err: unknown) {
    console.error("Migration failed midway, keeping guest tasks:", err);
    return { 
      success: false, 
      count: migratedTasks.length, 
      error: err instanceof Error ? err.message : "Lỗi đồng bộ giữa chừng." 
    };
  }
}

