import { TaskService } from "../../lib/services/taskService";
import { ITaskRepository } from "../../lib/repositories/types";
import { Task, CreateTaskInput } from "../../lib/types/task";

describe("TaskService Unit Tests", () => {
  let mockRepository: jest.Mocked<ITaskRepository>;
  let taskService: TaskService;

  const mockTask: Task = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    user_id: "user-uuid",
    title: "Test Task",
    description: "Test Description",
    completed: false,
    priority: "medium",
    category: "work",
    due_date: "2026-12-31",
    created_at: "2026-07-06T12:00:00Z",
    updated_at: "2026-07-06T12:00:00Z",
  };

  beforeEach(() => {
    mockRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      toggleComplete: jest.fn(),
    };
    taskService = new TaskService(mockRepository);
  });

  describe("Validation", () => {
    it("should fail validation if title is empty", async () => {
      const input: CreateTaskInput = {
        title: "",
        priority: "medium",
      };

      await expect(taskService.createTask(input)).rejects.toThrow("Tiêu đề không được để trống");
    });

    it("should fail validation if title contains only spaces", async () => {
      const input: CreateTaskInput = {
        title: "    ",
        priority: "medium",
      };

      await expect(taskService.createTask(input)).rejects.toThrow("Tiêu đề không được để trống");
    });

    it("should fail validation if title is longer than 200 characters", async () => {
      const input: CreateTaskInput = {
        title: "a".repeat(201),
        priority: "medium",
      };

      await expect(taskService.createTask(input)).rejects.toThrow("Tiêu đề tối đa 200 ký tự");
    });

    it("should fail validation if description is longer than 1000 characters", async () => {
      const input: CreateTaskInput = {
        title: "Valid Title",
        description: "a".repeat(1001),
        priority: "medium",
      };

      await expect(taskService.createTask(input)).rejects.toThrow("Mô tả tối đa 1000 ký tự");
    });

    it("should validate valid input successfully", async () => {
      const input: CreateTaskInput = {
        title: "Valid Title",
        description: "Valid Description",
        priority: "high",
        category: "personal",
        due_date: "2026-12-31",
      };

      mockRepository.create.mockResolvedValue({
        ...mockTask,
        ...input,
        description: input.description ?? null,
        category: input.category ?? null,
        due_date: input.due_date ?? null,
      });

      const result = await taskService.createTask(input);
      expect(result.task.title).toBe("Valid Title");
      expect(result.task.priority).toBe("high");
      expect(result.warning).toBeNull();
    });
  });

  describe("Due Date Warnings", () => {
    it("should warn if due date is in the past", async () => {
      const pastDate = "2020-01-01";
      const input: CreateTaskInput = {
        title: "Past Due Task",
        due_date: pastDate,
      };

      mockRepository.create.mockResolvedValue({
        ...mockTask,
        title: input.title,
        due_date: pastDate,
      });

      const result = await taskService.createTask(input);
      expect(result.warning).toBe("Hạn chót đang được đặt ở quá khứ.");
      expect(result.task.due_date).toBe(pastDate);
    });

    it("should not warn if due date is today or in the future", async () => {
      const today = new Date();
      const futureDateStr = `${today.getFullYear() + 1}-12-31`;
      const input: CreateTaskInput = {
        title: "Future Due Task",
        due_date: futureDateStr,
      };

      mockRepository.create.mockResolvedValue({
        ...mockTask,
        title: input.title,
        due_date: futureDateStr,
      });

      const result = await taskService.createTask(input);
      expect(result.warning).toBeNull();
    });

    it("should not warn if due date is empty", async () => {
      const input: CreateTaskInput = {
        title: "No Due Task",
        due_date: null,
      };

      mockRepository.create.mockResolvedValue({
        ...mockTask,
        title: input.title,
        due_date: null,
      });

      const result = await taskService.createTask(input);
      expect(result.warning).toBeNull();
    });
  });

  describe("Search, Filter, and Sort", () => {
    const tasks: Task[] = [
      {
        id: "1",
        user_id: "user-1",
        title: "Learn TypeScript",
        description: "Master TS generics and types",
        completed: false,
        priority: "high",
        category: "work",
        due_date: "2026-07-10",
        created_at: "2026-07-06T10:00:00Z",
        updated_at: "2026-07-06T10:00:00Z",
      },
      {
        id: "2",
        user_id: "user-1",
        title: "Buy groceries",
        description: "Milk, bread, eggs",
        completed: true,
        priority: "low",
        category: "personal",
        due_date: "2026-07-05",
        created_at: "2026-07-06T11:00:00Z",
        updated_at: "2026-07-06T11:00:00Z",
      },
      {
        id: "3",
        user_id: "user-1",
        title: "Fix bug in service",
        description: "Verify Zod validation errors",
        completed: false,
        priority: "medium",
        category: null,
        due_date: null,
        created_at: "2026-07-06T09:00:00Z",
        updated_at: "2026-07-06T09:00:00Z",
      },
    ];

    it("should search tasks case-insensitively by title or description", () => {
      const searchTitle = TaskService.searchTasks(tasks, "typescript");
      expect(searchTitle).toHaveLength(1);
      expect(searchTitle[0].id).toBe("1");

      const searchDesc = TaskService.searchTasks(tasks, "milk");
      expect(searchDesc).toHaveLength(1);
      expect(searchDesc[0].id).toBe("2");

      const searchEmpty = TaskService.searchTasks(tasks, "");
      expect(searchEmpty).toHaveLength(3);
    });

    it("should filter tasks by completed status, priority, and category", () => {
      const activeTasks = TaskService.filterTasks(tasks, { completed: false });
      expect(activeTasks).toHaveLength(2);
      expect(activeTasks.map((t) => t.id)).toEqual(["1", "3"]);

      const highTasks = TaskService.filterTasks(tasks, { priority: "high" });
      expect(highTasks).toHaveLength(1);
      expect(highTasks[0].id).toBe("1");

      const workTasks = TaskService.filterTasks(tasks, { category: "work" });
      expect(workTasks).toHaveLength(1);
      expect(workTasks[0].id).toBe("1");

      const noCategoryTasks = TaskService.filterTasks(tasks, { category: "none" });
      expect(noCategoryTasks).toHaveLength(1);
      expect(noCategoryTasks[0].id).toBe("3");
    });

    it("should sort tasks by created_at, due_date, and priority", () => {
      const sortedByCreatedAt = TaskService.sortTasks(tasks, "created_at", "asc");
      expect(sortedByCreatedAt.map((t) => t.id)).toEqual(["3", "1", "2"]);

      const sortedByPriorityDesc = TaskService.sortTasks(tasks, "priority", "desc");
      expect(sortedByPriorityDesc.map((t) => t.id)).toEqual(["1", "3", "2"]);

      const sortedByDueDateAsc = TaskService.sortTasks(tasks, "due_date", "asc");
      expect(sortedByDueDateAsc.map((t) => t.id)).toEqual(["2", "1", "3"]);
    });
  });
});
