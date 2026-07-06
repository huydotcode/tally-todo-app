# Tally - Ứng dụng Quản lý Công việc Tối giản

Tally là ứng dụng quản lý công việc (Todo List) được thiết kế theo phong cách **tươi sáng, chủ động, gọn gàng và tối giản (Bright UI)**. Ứng dụng hỗ trợ lưu trữ cục bộ khi chưa đăng nhập và tự động đồng bộ hóa lên đám mây bảo mật khi người dùng đăng nhập tài khoản.

---

## 🔗 Liên kết Dự án
*   **Demo Online**: [https://tally-todo-app.vercel.app/](https://tally-todo-app.vercel.app/)
*   **Mã nguồn**: [GitHub Repository](https://github.com/huydotcode/tally-todo-app)
*   **Tài liệu Thiết kế**: [DESIGN.md](DESIGN.md) | [UI_HISTORY.md](UI_HISTORY.md)

---

## ✨ Tính năng Nổi bật

1.  **Chế độ Khách (Guest Mode)**: Người dùng có thể sử dụng đầy đủ các tính năng CRUD ngay lập tức mà không cần đăng nhập. Dữ liệu được lưu trữ an toàn trong `localStorage` của trình duyệt.
2.  **Đăng nhập & Bảo mật (Cloud Sync)**: Sử dụng Supabase Auth để bảo mật tài khoản. Cơ chế **Row Level Security (RLS)** trên cơ sở dữ liệu ngăn chặn việc truy cập hoặc sửa đổi dữ liệu trái phép từ người dùng khác.
3.  **Đồng bộ Hóa Dữ liệu (Auto-Migration)**: Khi người dùng đăng ký hoặc đăng nhập lần đầu tiên, toàn bộ công việc cũ từ `localStorage` sẽ tự động được đồng bộ lên cơ sở dữ liệu đám mây Supabase một cách an toàn (có cơ chế rollback phòng lỗi mạng).
4.  **Thanh gõ nhanh Thông minh (Intelligent Quick Add Bar)**: Nằm cố định ở đáy trang, tự động trượt mở rộng mini-toolbar khi focus để gán nhanh mức độ ưu tiên, danh mục và hạn chót.
5.  **Bộ lọc phẳng Tiện ích (Filter Bar)**: Cung cấp ô tìm kiếm rộng và các nút lọc trạng thái, mức độ ưu tiên, danh mục được căn dọc 688px thẳng hàng với danh sách công việc.
6.  **Optimistic Updates (Cập nhật Tức thì)**: Trạng thái hoàn thành/khôi phục công việc được phản hồi ngay lập tức trên giao diện và tự động rollback (hoàn tác) nếu có lỗi mạng từ máy chủ.
7.  **Custom Confirm Modal**: Thay thế hoàn toàn hộp thoại mặc định của trình duyệt (`window.confirm`) bằng hộp thoại xác nhận tùy chỉnh theo đúng ngôn ngữ thiết kế của Tally, tích hợp nút Danger màu đỏ cảnh báo (`#DC2626`).
8.  **Ràng buộc & Validate Dữ liệu**:
    *   Sử dụng thư viện **Zod** để validate chặt chẽ tiêu đề (không trống, tối đa 200 ký tự) và mô tả (tối đa 1000 ký tự) ở cả tầng giao diện và tầng logic nghiệp vụ.
    *   Hiển thị cảnh báo trực quan ngay khi người dùng chọn hạn chót nằm trong quá khứ.

---

## 🏛️ Kiến trúc Phần mềm

Tally áp dụng mô hình **Kiến trúc Phân tầng (Layered Architecture)** kết hợp với **Repository Pattern** để đảm bảo khả năng mở rộng, dễ viết unit test và tách biệt logic nghiệp vụ khỏi tầng dữ liệu:

```
Next.js Component (React)
      ↓
useTasks() Hook (Quản lý state, loading, error, optimistic update)
      ↓
TaskService (Xử lý business rules, validate dữ liệu - không phụ thuộc nơi lưu trữ)
      ↓
ITaskRepository (Interface dùng chung định nghĩa các phương thức CRUD)
      ├── LocalStorageTaskRepository (Khi chưa đăng nhập - Guest Mode)
      └── SupabaseTaskRepository (Khi đã đăng nhập - Cloud Sync Mode)
```

*   **Tách biệt Tầng Dữ liệu**: `ITaskRepository` định nghĩa interface chuẩn cho các thao tác dữ liệu. Việc hoán đổi giữa LocalStorage và Supabase được quản lý tự động qua `RepositoryFactory` dựa trên trạng thái phiên đăng nhập của người dùng.
*   **Tầng Logic Nghiệp vụ**: `TaskService` đảm nhận vai trò validate dữ liệu thông qua Zod schema, lọc, tìm kiếm và sắp xếp. Tầng này độc lập hoàn toàn với React Components và nền tảng lưu trữ.

---

## ⚙️ Hướng dẫn Cài đặt & Chạy Local

### 1. Yêu cầu Hệ thống
*   Node.js phiên bản 18.x trở lên.
*   Trình quản lý gói `npm`.

### 2. Cài đặt các gói phụ thuộc
Di chuyển vào thư mục chứa mã nguồn `code` và chạy lệnh cài đặt:
```bash
cd code
npm install
```

### 3. Cấu hình Biến môi trường
Tạo tệp cấu hình `.env.local` trong thư mục `code/` bằng cách sao chép từ tệp mẫu:
```bash
cp .env.example .env.local
```
Mở tệp `.env.local` và điền thông tin kết nối Supabase của bạn:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Khởi chạy Ứng dụng
Khởi chạy máy chủ phát triển cục bộ:
```bash
npm run dev
```
Truy cập ứng dụng tại địa chỉ: [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Cấu hình Cơ sở dữ liệu Supabase

Nếu muốn tự chạy với một dự án Supabase mới, hãy chạy đoạn mã SQL dưới đây trong phần **SQL Editor** trên Supabase Dashboard để tạo bảng và thiết lập quyền truy cập bảo mật RLS:

```sql
-- 1. Tạo bảng tasks
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false NOT NULL,
    priority VARCHAR(10) DEFAULT 'medium'::character varying NOT NULL,
    category VARCHAR(50),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Kích hoạt Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 3. Tạo các chính sách bảo mật (RLS Policies)
-- Cho phép đọc các task của riêng mình
CREATE POLICY "Cho phép truy vấn task cá nhân" ON public.tasks
    FOR SELECT
    USING (auth.uid() = user_id);

-- Cho phép thêm task mới ứng với user_id của chính mình
CREATE POLICY "Cho phép thêm task cá nhân" ON public.tasks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Cho phép cập nhật task của riêng mình
CREATE POLICY "Cho phép sửa task cá nhân" ON public.tasks
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Cho phép xóa task của riêng mình
CREATE POLICY "Cho phép xóa task cá nhân" ON public.tasks
    FOR DELETE
    USING (auth.uid() = user_id);
```

---

## 🧪 Chạy Thử nghiệm (Unit Tests)

Bộ unit test bao phủ toàn bộ logic của `TaskService`, `LocalStorageTaskRepository`, và logic đồng bộ dữ liệu `migrateGuestTasks`.

Chạy toàn bộ các unit test bằng lệnh:
```bash
npm test
```
Kết quả kiểm thử đầu ra gồm 23/23 test cases vượt qua thành công:
```
Test Suites: 4 passed, 4 total
Tests:       23 passed, 23 total
Snapshots:   0 total
Time:        1.71 s
```
