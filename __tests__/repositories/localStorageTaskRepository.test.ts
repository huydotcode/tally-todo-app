import { LocalStorageTaskRepository } from "../../lib/repositories/localStorageTaskRepository";
import { CreateTaskInput, UpdateTaskInput } from "../../lib/types/task";

describe("LocalStorageTaskRepository Unit Tests", () => {
  let repository: LocalStorageTaskRepository;

  beforeEach(() => {
    repository = new LocalStorageTaskRepository();
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  });

  it("should create a task and store it in localStorage", async () => {
    const input: CreateTaskInput = {
      title: "Store this locally",
      description: "My description",
      priority: "medium",
      category: "work",
      due_date: "2026-07-20",
    };

    const task = await repository.create(input);
    expect(task.id).toBeDefined();
    expect(task.title).toBe(input.title);
    expect(task.completed).toBe(false);
    expect(task.created_at).toBeDefined();
    expect(task.updated_at).toBeDefined();

    // Verify it is saved in localStorage
    const savedData = localStorage.getItem("tally_tasks");
    expect(savedData).toBeDefined();
    const tasks = JSON.parse(savedData!);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe(task.id);
  });

  it("should get all tasks stored in localStorage", async () => {
    await repository.create({ title: "Task 1" });
    await repository.create({ title: "Task 2" });

    const allTasks = await repository.getAll();
    expect(allTasks).toHaveLength(2);
    expect(allTasks.map((t) => t.title)).toContain("Task 1");
    expect(allTasks.map((t) => t.title)).toContain("Task 2");
  });

  it("should get a task by id or return null if not found", async () => {
    const created = await repository.create({ title: "Find me" });
    const found = await repository.getById(created.id);
    expect(found).not.toBeNull();
    expect(found!.title).toBe("Find me");

    const notFound = await repository.getById("non-existent-uuid");
    expect(notFound).toBeNull();
  });

  it("should update task properties and update the updated_at timestamp", async () => {
    const created = await repository.create({
      title: "Original Title",
      description: "Original Description",
    });

    const updateInput: UpdateTaskInput = {
      title: "Updated Title",
      completed: true,
    };

    // Wait a brief moment to ensure updated_at timestamp differs from created_at
    await new Promise((resolve) => setTimeout(resolve, 10));

    const updated = await repository.update(created.id, updateInput);
    expect(updated.title).toBe("Updated Title");
    expect(updated.completed).toBe(true);
    expect(updated.description).toBe("Original Description"); // Keep unchanged fields
    expect(new Date(updated.updated_at).getTime()).toBeGreaterThan(
      new Date(created.created_at).getTime()
    );
  });

  it("should delete a task from localStorage", async () => {
    const t1 = await repository.create({ title: "To be deleted" });
    const t2 = await repository.create({ title: "Keep this" });

    await repository.delete(t1.id);

    const allTasks = await repository.getAll();
    expect(allTasks).toHaveLength(1);
    expect(allTasks[0].id).toBe(t2.id);
  });

  it("should toggle a task's completed state", async () => {
    const created = await repository.create({ title: "Toggle me", completed: false });
    const toggled = await repository.toggleComplete(created.id, true);
    expect(toggled.completed).toBe(true);

    const toggledBack = await repository.toggleComplete(created.id, false);
    expect(toggledBack.completed).toBe(false);
  });

  it("should handle corrupted JSON data in localStorage and return empty array instead of crashing", async () => {
    // Write corrupted JSON to localStorage
    localStorage.setItem("tally_tasks", "{invalid-json-string}");

    // Call getAll() and expect it to handle the error and return []
    const tasks = await repository.getAll();
    expect(tasks).toEqual([]);
  });
});
