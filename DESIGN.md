---
version: alpha
name: Tally Bright
description: Hệ thống thiết kế cho Tally — ứng dụng quản lý công việc tươi sáng, giàu năng lượng, tối giản.
colors:
  primary: "#FF4B2E"
  secondary: "#14213D"
  tertiary: "#FFC145"
  neutral: "#FAFAF7"
  surface: "#FFFFFF"
  on-surface: "{colors.secondary}"
  border: "#E7E2D8"
  success: "#1F9D55"
  error: "#DC2626"
typography:
  display:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.02em
  h1:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.01em
  h2:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.2
  h3:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.04em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.02em
rounded:
  none: 0px
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 24px
  margin: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 12px 20px
  button-primary-hover:
    backgroundColor: "#E43F24"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 12px 20px
    borderColor: "{colors.border}"
  button-secondary-hover:
    backgroundColor: "{colors.neutral}"
  checkbox:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    rounded: "{rounded.sm}"
    size: 20px
  checkbox-checked:
    backgroundColor: "{colors.primary}"
    borderColor: "{colors.primary}"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 10px 14px
    borderColor: "{colors.border}"
  input-field-focus:
    borderColor: "{colors.primary}"
  chip-priority-high:
    backgroundColor: "#FFE3DC"
    textColor: "#B8321C"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 4px 12px
  chip-priority-medium:
    backgroundColor: "#FFF3D6"
    textColor: "#8A5B00"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 4px 12px
  chip-priority-low:
    backgroundColor: "#DFF4E7"
    textColor: "#157A3E"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 4px 12px
  chip-category:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: 4px 12px
    borderColor: "{colors.border}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: 20px
    shadow: 0 1px 2px rgba(20, 33, 61, 0.06)
  list-item:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: 16px
    dividerColor: "{colors.border}"
---

# Tally — Design System

## Overview

**Tally** là ứng dụng quản lý công việc hằng ngày. Tính cách thương hiệu: **tươi sáng, chủ động, gọn gàng** — giao diện phải tạo cảm giác thúc đẩy người dùng hành động (thêm việc, hoàn thành việc) chứ không trầm lắng hay "chữa lành" như nhiều app productivity khác.

Đối tượng sử dụng chính là người dùng cá nhân bận rộn cần một công cụ rõ ràng, phản hồi nhanh, không rườm rà. Vì vậy bố cục ưu tiên sự **thoáng nhưng rõ ràng**: nhiều khoảng trắng để không gây rối mắt, nhưng độ tương phản màu sắc cao để phân biệt trạng thái (ưu tiên, hạn chót, hoàn thành) chỉ bằng một ánh nhìn.

Tally chủ động tránh các mô-típ thị giác đã trở nên khuôn mẫu và dễ đoán ("nhìn là biết AI dựng"): không dùng gradient tím-hồng, không lạm dụng glassmorphism, không bo góc quá lớn kiểu "bong bóng". Thay vào đó, bản sắc thị giác đến từ **một màu nhấn cam-đỏ rực rỡ duy nhất**, đặt trên nền trung tính ấm và văn bản mực đậm — tương phản dứt khoát, có chủ đích, không mơ hồ.

## Colors

Bảng màu xoay quanh một màu nhấn năng lượng duy nhất, được giữ neo bởi các tông trung tính ấm và một xanh mực đậm đáng tin cậy — tránh cảm giác "sặc sỡ vô tội vạ" thường thấy ở các bảng màu tươi sáng.

- **Primary (#FF4B2E — "Ember"):** Cam-đỏ rực, dùng **duy nhất** cho hành động quan trọng nhất trên mỗi màn hình: nút "Thêm công việc", trạng thái đã chọn, và điểm nhấn ưu tiên cao. Đây là màu duy nhất được phép "gào to" trên giao diện.
- **Secondary (#14213D — "Deep Navy"):** Xanh mực đậm gần đen, dùng cho tiêu đề và văn bản chính. Đóng vai trò "neo" thị giác, giữ cho bảng màu tươi sáng không bị trôi nổi hay thiếu nghiêm túc.
- **Tertiary (#FFC145 — "Amber"):** Vàng hổ phách ấm, dùng cho nhãn mức ưu tiên trung bình và các điểm nhấn phụ — tạo bậc thang năng lượng giữa mức thấp (xanh lá) và mức cao (cam-đỏ primary).
- **Neutral (#FAFAF7 — "Warm Paper"):** Nền trắng ngà ấm cho toàn bộ trang, mềm mắt hơn trắng tinh, làm nổi bật các thẻ nội dung màu trắng thuần bên trên.
- **Surface (#FFFFFF):** Nền của thẻ (card), input, và các phần tử nổi lên trên nền `neutral`.
- **On-surface:** Mặc định dùng lại `secondary` — đảm bảo văn bản trên các bề mặt luôn đạt độ tương phản cao.
- **Border (#E7E2D8):** Viền và đường phân cách rất nhẹ, chỉ đủ để tách khối mà không tạo thêm nhiễu thị giác.
- **Success (#1F9D55):** Dùng cho mức ưu tiên thấp và các chỉ báo hoàn thành tích cực.
- **Error (#DC2626):** Dành riêng cho hành động phá hủy (xóa) và thông báo lỗi validate — **cố tình chọn tông đỏ khác với `primary`** để người dùng không nhầm lẫn giữa "hành động chính" và "cảnh báo nguy hiểm".

## Typography

Toàn bộ hệ thống dùng một họ chữ duy nhất — **Inter** — để giữ giao diện gọn gàng, hiện đại, dễ đọc trên mọi kích thước màn hình. Thay vì pha trộn nhiều font để tạo "cá tính", Tally tạo phân cấp bằng **độ tương phản trọng lượng chữ (font-weight)** và **kích thước**, giữ đúng tinh thần tối giản nhưng vẫn rõ ràng.

- **Display & Headlines:** Inter Bold (700), dùng cho tiêu đề trang và các con số nổi bật (ví dụ: số lượng công việc còn lại). Letter-spacing âm nhẹ để tạo cảm giác chắc chắn, đanh gọn.
- **Body:** Inter Regular (400) ở 16px, tối ưu cho đọc nội dung task dài.
- **Label:** Inter SemiBold (600), dùng cho nút bấm và nhãn ưu tiên/danh mục — luôn có letter-spacing dương nhẹ để tăng độ rõ ở kích thước nhỏ.
- **Caption:** Kích thước nhỏ nhất (12px), dùng cho ngày giờ tạo, hạn chót phụ — màu chữ nên dùng `secondary` với độ mờ giảm (vd: 65% opacity) thay vì token màu riêng.

## Layout

Layout dùng lưới **max-width cố định** cho desktop (tối đa 720px cho vùng nội dung chính, canh giữa màn hình) để tránh danh sách công việc bị kéo dài quá mức trên màn hình rộng; chuyển sang **full-width có margin cố định** trên mobile.

Hệ thống khoảng cách theo thang cơ số 8px (`spacing.base = 8px`), với bước phụ 4px cho các điều chỉnh vi mô (khoảng cách icon-text, padding chip). Các task được nhóm trong danh sách dọc, mỗi item cách nhau bằng đường viền mảnh (`colors.border`) thay vì khoảng trắng lớn, giữ mật độ thông tin vừa phải mà không đổ bóng rối mắt.

## Elevation & Depth

Tally ưu tiên **đổ bóng rất nhẹ** (`0 1px 2px rgba(20, 33, 61, 0.06)`) thay vì để phẳng hoàn toàn — đủ để thẻ (card) và modal "nổi" nhẹ lên khỏi nền `neutral` mà không tạo cảm giác nặng nề hay giả lập vật lý quá đà. Không dùng đổ bóng nhiều lớp, không dùng glow màu — chiều sâu chỉ nên gợi ý, không cần phô diễn.

Phân cấp thị giác giữa các phần tử chủ yếu đến từ **tương phản màu nền** (surface trắng trên neutral ấm) và **viền mảnh**, đổ bóng chỉ đóng vai trò hỗ trợ nhẹ nhàng, không phải công cụ chính.

## Shapes

Ngôn ngữ hình khối của Tally là **bo góc nhẹ, có chủ đích** (`rounded.sm` đến `rounded.lg`, 4–8px) — đủ mềm để thân thiện, nhưng không bo tròn lớn kiểu "viên kẹo" vốn dễ khiến giao diện trông chung chung. Riêng các thành phần dạng nhãn (chip mức ưu tiên, chip danh mục) dùng `rounded.full` để tạo điểm nhấn hình con nhộng, giúp chúng nổi bật và dễ quét mắt giữa danh sách task.

## Components

- **Buttons:** Nút chính (`button-primary`) dùng màu `primary`, chỉ xuất hiện **một lần cho hành động quan trọng nhất** trên mỗi màn hình (thường là "Thêm công việc"). Nút phụ (`button-secondary`) dùng nền trắng, viền mảnh, chữ màu `secondary` — dành cho các hành động ít khẩn cấp hơn (Hủy, Đóng).
- **Checkboxes:** Trạng thái chưa hoàn thành là viền mảnh trên nền trắng; khi đánh dấu hoàn thành, nền chuyển sang `primary` kèm dấu tick trắng — tạo phản hồi tức thì, dứt khoát.
- **Chips (ưu tiên & danh mục):** Mỗi mức ưu tiên có cặp màu nền nhạt + chữ đậm cùng tông (đỏ cam cho cao, vàng cho trung bình, xanh lá cho thấp) để phân biệt ngay từ xa mà không cần đọc chữ. Chip danh mục dùng tông trung tính, không cạnh tranh thị giác với chip ưu tiên.
- **Input fields:** Nền trắng, viền mảnh mặc định; khi focus viền chuyển sang màu `primary` để phản hồi rõ ràng, không dùng box-shadow lan tỏa (glow) khi focus.
- **Lists:** Mỗi task là một `list-item` trên nền trắng, phân cách bằng viền mảnh phía dưới, không dùng zebra-striping (màu xen kẽ) để giữ giao diện sạch.
- **Cards:** Dùng cho modal thêm/sửa task và các khối tổng quan (vd: số liệu thống kê), bo góc `rounded.lg`, đổ bóng rất nhẹ theo mục Elevation.

## Do's and Don'ts

- Do dùng màu `primary` cho đúng một hành động quan trọng nhất mỗi màn hình — nếu mọi thứ đều nổi bật, không gì thực sự nổi bật.
- Don't dùng gradient (đặc biệt tím–hồng) hoặc hiệu ứng kính mờ (glassmorphism) — đi ngược tinh thần tối giản, tương phản dứt khoát của Tally.
- Do giữ đúng một họ chữ (Inter) trong toàn bộ ứng dụng; tạo phân cấp bằng trọng lượng và kích thước, không thêm font thứ hai.
- Don't bo góc lớn hơn `rounded.xl` (12px) cho các khối nội dung chính — bo góc lớn hơn chỉ dành riêng cho chip dạng con nhộng.
- Do đảm bảo tỷ lệ tương phản tối thiểu 4.5:1 cho văn bản thường, đặc biệt là chữ trên nền màu (chip, nút).
- Don't dùng màu `error` cho bất kỳ mục đích nào ngoài hành động phá hủy hoặc thông báo lỗi — tránh gây hiểu nhầm với `primary`.
- Do giữ đổ bóng ở mức tối thiểu (một lớp, rất nhẹ); không chồng nhiều lớp bóng hoặc dùng bóng màu.
