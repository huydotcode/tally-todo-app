"use client";

import React from "react";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: "all" | "active" | "completed";
  onStatusChange: (status: "all" | "active" | "completed") => void;
  priorityFilter: string;
  onPriorityChange: (priority: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  categoryFilter,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-bar-content">
        {/* Search input */}
        <div className="search-wrapper">
          <svg className="search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input text-body-md w-full"
            placeholder="Tìm kiếm công việc..."
          />
        </div>

        {/* Filter Options Row */}
        <div className="filters-row">
          {/* Status filter */}
          <div className="filter-group">
            <span className="filter-label">Trạng thái</span>
            <div className="segmented-control">
              <button
                type="button"
                className={`segment-btn ${statusFilter === "all" ? "active" : ""}`}
                onClick={() => onStatusChange("all")}
              >
                Tất cả
              </button>
              <button
                type="button"
                className={`segment-btn ${statusFilter === "active" ? "active" : ""}`}
                onClick={() => onStatusChange("active")}
              >
                Chưa xong
              </button>
              <button
                type="button"
                className={`segment-btn ${statusFilter === "completed" ? "active" : ""}`}
                onClick={() => onStatusChange("completed")}
              >
                Đã xong
              </button>
            </div>
          </div>

          {/* Priority filter */}
          <div className="filter-group">
            <span className="filter-label">Ưu tiên</span>
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="select-filter text-label-md"
            >
              <option value="all">Tất cả mức</option>
              <option value="high">Cao</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="filter-group">
            <span className="filter-label">Danh mục</span>
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="select-filter text-label-md"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="none">🏷️ Không có danh mục</option>
              <option value="work">💼 Công việc</option>
              <option value="personal">🏠 Cá nhân</option>
              <option value="learning">📚 Học tập</option>
              <option value="shopping">🛒 Mua sắm</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
