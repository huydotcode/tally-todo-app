# CHECKLIST.md — Tally (Todo List App)

> Checklist đầy đủ từ khâu chuẩn bị đến deploy. Tick `[x]` khi hoàn thành từng mục.
> Tham khảo `DESIGN.md` (design tokens) và `Tally-Mo-Ta-Du-An.md` (mô tả kiến trúc) song song khi thực hiện.

---

## Giai đoạn 0 — Chuẩn bị môi trường & tài khoản

- [ ] Cài **Node.js** bản LTS (>= 20) — kiểm tra: `node -v`
- [ ] Cài **Git**, cấu hình `user.name` / `user.email`
- [ ] Tạo tài khoản [GitHub](https://github.com) (nếu chưa có) — nơi lưu source code
- [ ] Tạo tài khoản [Supabase](https://supabase.com) (đăng nhập bằng GitHub cho nhanh)
- [ ] Tạo tài khoản [Vercel](https://vercel.com) (đăng nhập bằng GitHub) — dùng để deploy
- [ ] Cài extension **Prettier** + **ESLint** trên editor (VS Code) để format code nhất quán
- [ ] Tạo repo GitHub trống tên `tally` (không cần README/gitignore, sẽ tạo qua `create-next-app`)

---

## Giai đoạn 1 — Làm bản Mockup tĩnh (HTML/CSS thuần)

> Mục đích: chốt giao diện, layout, spacing trước khi viết logic — tránh vừa code React vừa chỉnh CSS gây mất thời gian.

- [x] Tạo 1 file `ui-templates/index.html` + `ui-templates/style.css` riêng (thay cho folder `mockup` theo yêu cầu), **không dùng framework**, chỉ HTML/CSS thuần
- [x] Khai báo font Inter qua Google Fonts hoặc `@font-face` trong `<head>`
- [x] Convert design tokens từ `DESIGN.md` thành CSS variables ở đầu file `style.css`:
  ```css
  :root {
    --color-primary: #FF4B2E;
    --color-secondary: #14213D;
    --color-tertiary: #FFC145;
    --color-neutral: #FAFAF7;
    --color-surface: #FFFFFF;
    --color-border: #E7E2D8;
    --color-success: #1F9D55;
    --color-error: #DC2626;

    --radius-sm: 4px;
    --radius-md: 6px;
    --radius-lg: 8px;
    --radius-full: 9999px;

    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 32px;
  }
  ```
- [x] Dựng khung layout trang chính: header (logo + nút đăng nhập), thanh filter/search, danh sách task, nút "Thêm công việc" nổi bật (dùng `--color-primary`)
- [x] Dựng 1 task item mẫu: checkbox, tiêu đề, mô tả rút gọn, chip priority (3 màu), chip category, hạn chót, nút sửa/xóa
- [x] Dựng modal/form thêm-sửa task: input tiêu đề, textarea mô tả, select priority, select/input category, input date
- [x] Dựng trạng thái rỗng (empty state) khi chưa có task nào
- [x] Dựng trạng thái trang đăng nhập đơn giản (email + password)
- [x] Kiểm tra responsive bằng cách resize trình duyệt xuống mobile (~375px) — điều chỉnh layout thanh filter, modal full-screen trên mobile
- [x] Tự chấm điểm: mockup có tránh được gradient tím-hồng / glassmorphism / bo góc quá lớn không? (đối chiếu mục "Do's and Don'ts" trong `DESIGN.md`)
- [x] Chụp lại ảnh màn hình mockup để làm tài liệu tham khảo khi code React (không bắt buộc nhưng hữu ích)


---

## Giai đoạn 2 — Khởi tạo dự án Next.js

- [x] Tạo project Next.js 16 (chọn TypeScript, Tailwind, App Router, ESLint):
  ```bash
  # Cách 1 (Nếu thư mục code/ rỗng):
  npx create-next-app@latest code --typescript --tailwind --app --eslint --src-dir=false --import-alias="@/*" --use-npm
  
  # Cách 2 (Nếu thư mục code/ đã chứa .git hoặc README.md):
  # Khởi tạo qua thư mục tạm rồi di chuyển file vào code/ để tránh conflict:
  npx create-next-app@latest temp-tally --typescript --tailwind --app --eslint --src-dir=false --import-alias="@/*" --use-npm
  # Di chuyển tất cả file từ temp-tally sang code/ (giữ nguyên .git của code/)
  # Xóa thư mục temp-tally
  ```
- [x] Cấu hình Tailwind CSS v4 (CSS-First):
  - Mở file `code/app/globals.css` và cấu hình các tokens màu sắc/phông chữ/bo góc bằng `@theme` directive của Tailwind v4:
    ```css
    @import "tailwindcss";

    @theme {
      --color-primary: #FF4B2E;
      --color-secondary: #14213D;
      --color-tertiary: #FFC145;
      --color-neutral: #FAFAF7;
      --color-surface: #FFFFFF;
      --color-border: #E7E2D8;
      --color-success: #1F9D55;
      --color-error: #DC2626;

      --font-sans: 'Inter', sans-serif;

      --radius-sm: 4px;
      --radius-md: 6px;
      --radius-lg: 8px;
      --radius-xl: 12px;
      --radius-full: 9999px;
    }
    ```
- [x] Cài thêm các package cần thiết:
  ```bash
  npm install @supabase/supabase-js @supabase/ssr zod
  npm install -D jest @testing-library/react @testing-library/jest-dom ts-jest @types/jest
  ```
- [x] Dọn file mặc định của `create-next-app` (xóa nội dung mẫu trong `app/page.tsx`, `app/globals.css`)
- [x] Import font Inter vào `app/layout.tsx` bằng `next/font/google`
- [x] Khởi tạo git, commit đầu tiên, push lên GitHub repo đã tạo ở Giai đoạn 0:
  ```bash
  git add . && git commit -m "chore: init Next.js project"
  git remote add origin <link-repo-github>
  git push -u origin main
  ```

---

## Giai đoạn 3 — Setup Supabase

- [x] Tạo project mới trên Supabase Dashboard, đặt tên `tally`, chọn region gần (Singapore)
- [x] Vào **SQL Editor**, chạy script tạo bảng và RLS (đã tối ưu hóa theo best practices của Supabase):
  ```sql
  -- 1. Tạo bảng tasks với foreign key có CASCADE khi xóa user
  create table tasks (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    title text not null,
    description text,
    completed boolean not null default false,
    priority text not null default 'medium',
    category text,
    due_date date,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

  -- 2. Tạo index cho cột user_id để tối ưu hóa truy vấn và RLS
  create index tasks_user_id_idx on tasks(user_id);

  -- 3. Kích hoạt Row Level Security (RLS)
  alter table tasks enable row level security;

  -- 4. Tạo các policy phân quyền chi tiết (hoàn hảo về bảo mật & hiệu năng)
  create policy "Users can select their own tasks" on tasks
    for select to authenticated using (user_id = (select auth.uid()));

  create policy "Users can insert their own tasks" on tasks
    for insert to authenticated with check (user_id = (select auth.uid()));

  create policy "Users can update their own tasks" on tasks
    for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

  create policy "Users can delete their own tasks" on tasks
    for delete to authenticated using (user_id = (select auth.uid()));
  ```
- [x] Vào **Authentication > Providers**, bật Email/Password (mặc định thường đã bật sẵn)
- [x] Vào **Project Settings > API**, copy `Project URL` và `anon public key`
- [x] Tạo file `.env.local` ở root project (không commit lên Git):
  ```
  NEXT_PUBLIC_SUPABASE_URL=<project-url>
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
  ```
- [x] Tạo file `.env.example` (commit được) liệt kê các biến trên nhưng để trống giá trị
- [x] Xác nhận `.env.local` đã có trong `.gitignore` (mặc định `create-next-app` đã thêm sẵn)
- [x] Test kết nối: insert thử 1 row qua SQL Editor, query lại bằng `select * from tasks` để chắc chắn bảng hoạt động

---

## Giai đoạn 4 — Xây tầng dữ liệu (types, repository, service)

- [x] Tạo `lib/types/task.ts` — định nghĩa `Task`, `Priority`, `CreateTaskInput`, `UpdateTaskInput`
- [x] Tạo `lib/supabase/client.ts` — khởi tạo Supabase client dùng biến môi trường
- [x] Tạo `lib/repositories/types.ts` — định nghĩa interface `ITaskRepository` (getAll, getById, create, update, delete, toggleComplete)
- [x] Tạo `lib/repositories/localStorageTaskRepository.ts`:
  - [x] Đọc/ghi mảng task dưới key cố định, vd `tally_tasks`
  - [x] Bọc `try/catch` khi `JSON.parse` — nếu dữ liệu localStorage hỏng, trả về mảng rỗng thay vì crash
- [x] Tạo `lib/repositories/supabaseTaskRepository.ts`:
  - [x] Implement từng method gọi `supabase.from('tasks')...`
  - [x] Bắt lỗi từ Supabase (`error` object) và ném lỗi có message rõ ràng
- [x] Tạo `lib/repositories/repositoryFactory.ts` — trả về repository tương ứng dựa vào trạng thái đăng nhập
- [x] Tạo `lib/services/taskService.ts`:
  - [x] Validate `title`: không rỗng, tối đa 200 ký tự
  - [x] Validate `description`: tối đa 1000 ký tự (không bắt buộc)
  - [x] Validate `priority`: phải thuộc `['low','medium','high']`
  - [x] Validate `dueDate`: đúng định dạng ngày; nếu ở quá khứ → gắn cờ cảnh báo, không chặn
  - [x] Các hàm search/filter/sort chạy trên dữ liệu đã lấy từ repository (không phụ thuộc nơi lưu trữ)
- [x] Tạo `lib/migration/migrateGuestTasks.ts`:
  - [x] Đọc toàn bộ task từ localStorage
  - [x] Insert từng task lên Supabase với `user_id` hiện tại
  - [x] Sau khi insert **thành công toàn bộ**, xóa dữ liệu localStorage và đánh dấu cờ `migrated = true`
  - [x] Nếu insert lỗi giữa chừng, giữ nguyên localStorage, không xóa (tránh mất dữ liệu)

---

## Giai đoạn 5 — Viết Unit Test cho tầng logic

- [x] Cấu hình `jest.config.js` + script `"test": "jest"` trong `package.json`
- [x] Test `taskService`: title rỗng, title quá dài, priority sai giá trị, due date quá khứ, search/filter/sort đúng kết quả
- [x] Test `localStorageTaskRepository`: đọc/ghi đúng, xử lý dữ liệu hỏng trong localStorage (mock `window.localStorage`)
- [x] Test `migrateGuestTasks`: migrate thành công xóa localStorage; migrate lỗi giữa chừng thì giữ nguyên dữ liệu (dùng mock repository)
- [x] Chạy `npm test`, đảm bảo toàn bộ test pass trước khi sang giao diện

---

## Giai đoạn 6 — Chuyển Mockup thành giao diện Next.js (React)

- [x] Tạo `hooks/useAuth.ts` — theo dõi trạng thái đăng nhập qua Supabase Auth (`onAuthStateChange`)
- [x] Tạo `hooks/useTasks.ts` — gọi `taskService` qua repository tương ứng, expose `tasks`, `loading`, `error`, các hàm `addTask/editTask/deleteTask/toggleTask`
- [x] Convert mockup → components, giữ đúng class/spacing đã chốt ở Giai đoạn 1:
  - [x] `components/TaskList.tsx`
  - [x] `components/TaskItem.tsx` (checkbox, chip priority, chip category, hạn chót)
  - [x] `components/TaskFormModal.tsx` (thêm/sửa, có validate phía client)
  - [x] `components/FilterBar.tsx` (search debounce 300ms, filter trạng thái/category/priority)
  - [x] `components/EmptyState.tsx`
  - [x] `components/AuthStatus.tsx` (hiện nút đăng nhập/đăng xuất tùy trạng thái)
- [x] Dựng `app/page.tsx` — trang chính, ghép các component qua `useTasks`
- [x] Dựng `app/login/page.tsx` — form đăng nhập/đăng ký qua Supabase Auth
- [x] Gắn logic: khi `useAuth` phát hiện vừa đăng nhập lần đầu → gọi `migrateGuestTasks`
- [x] Optimistic update cho toggle complete: cập nhật UI ngay, rollback nếu request lỗi
- [x] Toast/thông báo lỗi khi thao tác Supabase thất bại (mất mạng, hết session...)
- [x] Kiểm tra responsive thực tế trên Chrome DevTools (mobile, tablet, desktop)

---

## Giai đoạn 7 — Rà soát Edge Case (Không được bỏ qua)

- [x] Nhập title toàn khoảng trắng → phải báo lỗi, không lưu được task rỗng
- [x] Nhập title/description vượt giới hạn ký tự → hiện cảnh báo ngay khi gõ
- [x] Xóa task → có dialog xác nhận, hủy được thao tác
- [x] Sửa task rồi đóng modal không lưu → dữ liệu cũ không bị mất
- [x] Ngắt mạng giữa lúc thêm task (dùng DevTools > Network > Offline) → có thông báo lỗi, không crash app
- [x] Đăng nhập với tài khoản đã có task trên Supabase + đang có task guest trong localStorage → xác nhận migrate đúng, không trùng lặp, không mất dữ liệu
- [x] Đăng xuất rồi đăng nhập lại cùng tài khoản → không migrate lại lần nữa (tránh trùng task)
- [x] Test trên trình duyệt ẩn danh (chưa có localStorage) → app vẫn chạy bình thường, không lỗi console
- [x] Kiểm tra RLS: thử gọi API Supabase bằng token của user khác (hoaching không có token) → phải bị từ chối

---

## Giai đoạn 8 — README & tài liệu nộp bài

- [x] Viết `README.md` gồm:
  - [x] Giới thiệu ngắn gọn dự án + link demo online
  - [x] Danh sách tính năng đã làm
  - [x] Hướng dẫn cài đặt local: clone repo, `npm install`, tạo `.env.local` từ `.env.example`, `npm run dev`
  - [x] Hướng dẫn setup Supabase riêng (nếu người chấm muốn tự chạy với DB của họ): script SQL tạo bảng + RLS
  - [x] Cách chạy test: `npm test`
  - [x] Giải thích ngắn gọn kiến trúc (Repository Pattern, vì sao tách Service/Repository)
- [x] Đính kèm `DESIGN.md` vào repo (thư mục `docs/` hoặc root) để thể hiện quy trình thiết kế bài bản
- [x] Kiểm tra lại toàn bộ code đã format (Prettier) và không còn `console.log` thừa, code chết (dead code)

---

## Giai đoạn 9 — Deploy

- [x] Push toàn bộ code mới nhất lên GitHub
- [x] Vào Vercel → **Add New Project** → import đúng repo GitHub `tally`
- [x] Khai báo Environment Variables trên Vercel (giống `.env.local`):
  - [x] `NEXT_PUBLIC_SUPABASE_URL`
  - [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] Bấm Deploy, chờ build xong, mở link Vercel để kiểm tra
- [x] Test trực tiếp trên bản deploy: đăng ký tài khoản mới, thêm/sửa/xóa task, đăng xuất/đăng nhập lại
- [x] Vào Supabase Dashboard kiểm tra bảng `tasks` có dữ liệu thật khớp với thao tác vừa test
- [x] Cập nhật link demo online vào `README.md` và commit lại

---

## Giai đoạn 10 — Rà soát cuối & Chuẩn bị nộp/phỏng vấn

- [ ] Đọc lại toàn bộ đề bài gốc, tick chéo từng yêu cầu bắt buộc đã đáp ứng chưa (hiển thị, thêm, sửa, xóa, đánh dấu hoàn thành, tìm kiếm/lọc, xử lý dữ liệu không hợp lệ, README)
- [ ] Kiểm tra các mục khuyến khích đã đạt: phân trang/sắp xếp, responsive, Unit Test, deploy online (Docker có thể bỏ nếu không đủ thời gian, không bắt buộc)
- [ ] Chuẩn bị sẵn câu trả lời cho các câu hỏi dự kiến khi phỏng vấn:
  - [ ] Vì sao chọn Next.js + Supabase thay vì Java/Spring Boot như JD
  - [ ] Vì sao tách Repository/Service thay vì viết thẳng trong component
  - [ ] Giải thích luồng migrate dữ liệu guest → tài khoản
  - [ ] Mức độ dùng AI hỗ trợ, phần nào tự làm — trả lời trung thực, có thể giải thích được mọi dòng code
- [ ] Gửi: link GitHub repo + link demo Vercel + (tùy chọn) file mô tả dự án đính kèm email/form ứng tuyển
