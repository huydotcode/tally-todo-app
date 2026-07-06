"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { AuthStatus } from "../components/AuthStatus";
import { FilterBar } from "../components/FilterBar";
import { TaskList } from "../components/TaskList";
import { TaskFormModal } from "../components/TaskFormModal";
import { QuickAddBar } from "../components/QuickAddBar";
import { Toast, ToastItem } from "../components/Toast";
import { TaskService } from "../lib/services/taskService";
import { Task, CreateTaskInput, UpdateTaskInput } from "../lib/types/task";
import { migrateGuestTasks } from "../lib/migration/migrateGuestTasks";

export default function Home() {
  const { user, loading: authLoading, signOut } = useAuth();
  const {
    tasks,
    loading: tasksLoading,
    error,
    warning,
    addTask,
    editTask,
    deleteTask,
    toggleTask,
    refreshTasks,
    setError,
    setWarning,
  } = useTasks(user);

  const router = useRouter();

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  const taskListRef = useRef<HTMLDivElement>(null);

  const addToast = (message: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Watch for hook errors and warnings
  useEffect(() => {
    if (error) {
      addToast(error, "error");
      setError(null);
    }
  }, [error, setError]);

  useEffect(() => {
    if (warning) {
      addToast(warning, "error");
      setWarning(null);
    }
  }, [warning, setWarning]);

  // Migration trigger on login
  const [hasMigratedInSession, setHasMigratedInSession] = useState(false);
  useEffect(() => {
    if (user && !hasMigratedInSession) {
      const runMigration = async () => {
        try {
          const result = await migrateGuestTasks();
          if (result.success && result.count > 0) {
            addToast(`Đã đồng bộ thành công ${result.count} công việc từ máy của bạn!`);
            refreshTasks();
          } else if (!result.success && result.error) {
            addToast(`Lỗi đồng bộ dữ liệu: ${result.error}`, "error");
          }
        } catch (e: any) {
          console.error("Migration failed:", e);
        } finally {
          setHasMigratedInSession(true);
        }
      };
      runMigration();
    }
  }, [user, hasMigratedInSession, refreshTasks]);

  // Reset migration flag on logout
  useEffect(() => {
    if (!user) {
      setHasMigratedInSession(false);
    }
  }, [user]);

  // Filter and search tasks
  const processedTasks = useMemo(() => {
    let result = [...tasks];
    
    result = TaskService.searchTasks(result, searchQuery);
    
    const activeFilters: { completed?: boolean; priority?: string; category?: string } = {};
    if (statusFilter !== "all") {
      activeFilters.completed = statusFilter === "completed";
    }
    if (priorityFilter !== "all") {
      activeFilters.priority = priorityFilter;
    }
    if (categoryFilter !== "all") {
      activeFilters.category = categoryFilter;
    }
    result = TaskService.filterTasks(result, activeFilters);
    result = TaskService.sortTasks(result, "created_at", "asc");
    
    return result;
  }, [tasks, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  // Task count details
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      const updated = await toggleTask(id, completed);
      addToast(
        completed
          ? `Đã hoàn thành: "${updated.title}"`
          : `Đã khôi phục: "${updated.title}"`
      );
    } catch (e: any) {
      addToast(e.message || "Không thể cập nhật trạng thái.", "error");
    }
  };

  const handleEditTrigger = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCreateTrigger = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (input: CreateTaskInput | UpdateTaskInput) => {
    try {
      if (editingTask) {
        const { task, warning: warn } = await editTask(editingTask.id, input);
        addToast(`Đã cập nhật: "${task.title}"`);
        if (warn) addToast(warn, "error");
      } else {
        const { task, warning: warn } = await addTask(input as CreateTaskInput);
        addToast(`Đã thêm công việc: "${task.title}"`);
        if (warn) addToast(warn, "error");
        
        // Scroll task list to bottom
        setTimeout(() => {
          if (taskListRef.current) {
            taskListRef.current.scrollTop = taskListRef.current.scrollHeight;
          }
        }, 100);
      }
    } catch (e: any) {
      addToast(e.message || "Thao tác thất bại.", "error");
      throw e;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      addToast("Đã xóa công việc thành công");
    } catch (e: any) {
      addToast(e.message || "Không thể xóa công việc.", "error");
    }
  };

  const showLoading = authLoading || tasksLoading;

  const handleLogoClick = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
    router.push("/");
  };

  return (
    <div className="app-container">
      <Toast toasts={toasts} onDismiss={removeToast} />
      
      {/* Header */}
      <header className="app-header">
        <div className="logo" id="header-logo" onClick={handleLogoClick}>
          <Image src="/logo.svg" alt="Tally Logo" width={24} height={24} />
          <span>Tally</span>
        </div>
        
        <AuthStatus user={user} signOut={signOut} />
      </header>

      {/* Main Content */}
      <main className="app-main">
        {showLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-body-md animate-pulse">Đang tải dữ liệu...</div>
          </div>
        ) : totalCount === 0 ? (
          /* Empty State View */
          <section id="view-empty" className="view-section active justify-center items-center">
            <div className="empty-card">
              <div className="empty-icon">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="empty-title">Chưa có công việc nào</h3>
              <p className="empty-subtitle">
                Bắt đầu ngày làm việc hiệu quả của bạn bằng cách thêm các công việc cần hoàn thành ngay hôm nay.
              </p>
              <button onClick={handleCreateTrigger} id="empty-add-trigger" className="btn btn-primary">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                Thêm công việc đầu tiên
              </button>
            </div>
          </section>
        ) : (
          /* Main Application View */
          <section id="view-app" className="view-section active">
            {/* Filter Bar */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityChange={setPriorityFilter}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
            />

            {/* Page Title & Progress */}
            <div className="page-title-container">
              <div className="page-title-row">
                <h1 className="text-h1">Công việc của tôi</h1>
                <span id="task-counter" className="text-label-md bg-secondary text-white px-2 py-0.5 rounded-full text-xs">
                  {processedTasks.length}
                </span>
              </div>
              <div className="task-progress-container">
                <div className="progress-bar-track">
                  <div
                    id="progress-bar-fill"
                    className="progress-bar-fill"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <span id="progress-text" className="progress-text">
                  {progressPercent}% hoàn thành ({completedCount}/{totalCount})
                </span>
              </div>
            </div>

            {/* Task List */}
            <TaskList
              ref={taskListRef}
              tasks={processedTasks}
              onToggle={handleToggle}
              onEdit={handleEditTrigger}
              onDelete={handleDelete}
            />

            {/* Quick Add Input Bar */}
            <QuickAddBar onSubmit={handleFormSubmit} onShowToast={addToast} />
          </section>
        )}
      </main>

      {/* Create / Edit Form Modal */}
      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        task={editingTask}
      />
    </div>
  );
}
