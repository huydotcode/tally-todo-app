import { migrateGuestTasks } from "../../lib/migration/migrateGuestTasks";
import { SupabaseTaskRepository } from "../../lib/repositories/supabaseTaskRepository";

jest.mock("../../lib/repositories/supabaseTaskRepository");

describe("migrateGuestTasks Unit Tests", () => {
  const LOCAL_STORAGE_KEY = "tally_tasks";
  const MIGRATED_FLAG_KEY = "tally_tasks_migrated";
  
  let mockCreate: jest.Mock;

  const guestTasks = [
    { title: "Task 1", completed: false, priority: "low" },
    { title: "Task 2", completed: true, priority: "high", description: "desc" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    mockCreate = SupabaseTaskRepository.prototype.create as jest.Mock;
  });

  it("should return immediately and do nothing if already migrated", async () => {
    localStorage.setItem(MIGRATED_FLAG_KEY, "true");
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(guestTasks));

    const result = await migrateGuestTasks();
    expect(result).toEqual({ success: true, count: 0 });
    expect(mockCreate).not.toHaveBeenCalled();
    // LocalStorage should remain intact
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBeDefined();
  });

  it("should return success and set migrated flag if there are no guest tasks", async () => {
    const result = await migrateGuestTasks();
    expect(result).toEqual({ success: true, count: 0 });
    expect(localStorage.getItem(MIGRATED_FLAG_KEY)).toBe("true");
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("should migrate tasks successfully, clear guest tasks and set migrated flag", async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(guestTasks));
    mockCreate.mockResolvedValue({ id: "mock-uuid" });

    const result = await migrateGuestTasks();
    expect(result).toEqual({ success: true, count: 2 });
    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(mockCreate).toHaveBeenNthCalledWith(1, {
      title: "Task 1",
      completed: false,
      priority: "low",
      description: undefined,
      category: undefined,
      due_date: undefined,
    });
    expect(mockCreate).toHaveBeenNthCalledWith(2, {
      title: "Task 2",
      completed: true,
      priority: "high",
      description: "desc",
      category: undefined,
      due_date: undefined,
    });

    // Verify localStorage is cleaned up
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(MIGRATED_FLAG_KEY)).toBe("true");
  });

  it("should retain guest tasks in localStorage if migration fails midway", async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(guestTasks));
    
    // First succeeds, second fails
    mockCreate
      .mockResolvedValueOnce({ id: "mock-uuid-1" })
      .mockRejectedValueOnce(new Error("Network connection lost"));

    const result = await migrateGuestTasks();
    expect(result.success).toBe(false);
    expect(result.count).toBe(1);
    expect(result.error).toContain("Network connection");

    // LocalStorage should NOT be deleted, and migrated flag should NOT be true
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).not.toBeNull();
    expect(localStorage.getItem(MIGRATED_FLAG_KEY)).toBeNull();
    
    const remainingTasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!);
    expect(remainingTasks).toHaveLength(2);
  });
});
