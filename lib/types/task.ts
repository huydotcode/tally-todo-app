import { z } from "zod";

export const PrioritySchema = z.enum(["low", "medium", "high"]);
export type Priority = z.infer<typeof PrioritySchema>;

export const TaskSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable().optional(),
  title: z.string().trim().min(1, "Tiêu đề không được để trống").max(200, "Tiêu đề tối đa 200 ký tự"),
  description: z.string().max(1000, "Mô tả tối đa 1000 ký tự").nullable().optional(),
  completed: z.boolean().default(false),
  priority: PrioritySchema.default("medium"),
  category: z.string().nullable().optional(),
  due_date: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;

export const CreateTaskInputSchema = TaskSchema.pick({
  title: true,
  description: true,
  priority: true,
  category: true,
  due_date: true,
}).extend({
  completed: z.boolean().optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;

export const UpdateTaskInputSchema = CreateTaskInputSchema.partial();

export type UpdateTaskInput = z.infer<typeof UpdateTaskInputSchema>;
