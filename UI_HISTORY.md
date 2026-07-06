# Tally — UI Modifications & Layout History

Tài liệu này lưu trữ lịch sử các thay đổi, quyết định thiết kế và cấu trúc giao diện đã được thống nhất và hoàn thiện trong thư mục [ui-templates](file:///d:/Projects/tally/ui-templates). 

> [!IMPORTANT]
> Tất cả các thay đổi giao diện khi chuyển sang code React/Next.js ở các giai đoạn sau **bắt buộc phải tuân thủ và tái hiện chính xác** các cấu trúc layout và thiết kế được mô tả dưới đây.

---

## 1. Cấu trúc Layout ứng dụng (App-style Flex Layout)

Để tối ưu hóa trải nghiệm trên cả Desktop và Di động, giao diện của Tally đã được chuyển đổi từ dạng cuộn trang truyền thống sang **Mô hình ứng dụng Flexbox cố định chiều cao**:
*   **Khóa cuộn toàn trang**: `html, body` và `.app-container` được khóa chiều cao cố định `height: 100vh` và ẩn thanh cuộn của trình duyệt (`overflow: hidden`). Tránh hiện tượng giật lắc trang khi mở bàn phím ảo trên điện thoại.
*   **Cuộn danh sách độc lập**: Danh sách công việc `.task-list` được thiết lập `overflow-y: auto` và co giãn `flex: 1` để tự tạo thanh cuộn bên trong khu vực của nó.
*   **Vị trí Thanh gõ công việc**: Thanh nhập liệu `.quick-add-container` nằm tĩnh ở phía dưới danh sách task (bằng cơ chế Flexbox tự nhiên). Khi người dùng cuộn danh sách task, các task sẽ **dừng lại ngay sát cạnh trên** của thanh nhập liệu nhanh, tuyệt đối không trượt xuống dưới hoặc bị che lấp bởi thanh gõ.

---

## 2. Quy tắc Gióng hàng dọc Đồng bộ (Unified Alignment Grid)

Để giữ cho giao diện cân đối và chuyên nghiệp trên màn hình Desktop lớn, các thành phần nội dung chính được gióng hàng dọc thẳng tắp trên một lưới trục:
*   Các thành phần tham gia lưới gióng hàng:
    1.  Nội dung Header (Logo & nút Đăng nhập/Đăng xuất)
    2.  Tiêu đề trang (`.page-title-container`)
    3.  Nội dung bộ lọc (`.filter-bar-content`)
    4.  Khung danh sách task (`.task-list`)
    5.  Thanh gõ công việc nhanh (`.quick-add-container`)
*   **Quy tắc CSS đồng bộ**:
    `width: calc(100% - 32px); max-width: 688px; margin-left: auto; margin-right: auto;`
    *   *Trên Desktop*: Căn giữa hoàn hảo với chiều rộng tối đa 688px.
    *   *Trên Mobile*: Co giãn tự động và giữ khoảng đệm 16px ở hai bên mép màn hình.

---

## 3. Thiết kế Header & Filter Bar kéo dài tràn viền (Full-Width Top Panel)

*   **Header (`.app-header`)**:
    *   Kéo dài full màn hình (100% chiều rộng).
    *   Màu nền: Trắng tinh (`--color-surface`) để tách biệt rõ rệt.
    *   Viền dưới: 1px màu xám nhẹ (`--color-border`).
    *   Padding: Dọc `8px` (`var(--space-sm)`), Ngang `32px` (`var(--space-xl)`).
*   **Filter Bar (`.filter-bar`)**:
    *   Được thiết kế phẳng hoàn toàn dưới dạng một Sub-header kéo dài full màn hình ngay dưới Header.
    *   Không có bo góc, không có đổ bóng lơ lửng. Nền trắng và có viền xám mảnh 1px ở dưới đáy (`border-bottom`).
    *   Padding dọc: `16px` (`var(--space-md)`).

---

## 4. Thanh nhập liệu thông minh (Intelligent Quick Add Input Bar - Phương án A)

Nút "Thêm công việc" truyền thống đã được thay thế hoàn toàn bằng thanh nhập liệu nhanh thông minh nằm ở dưới danh sách task:
*   **Cơ chế hoạt động**:
    *   *Trạng thái bình thường*: Chỉ hiển thị một ô gõ chữ đơn giản kèm nút gửi mũi tên cam-đỏ.
    *   *Trạng thái Focus*: Khi người dùng click gõ chữ, một thanh công cụ phụ (Mini-toolbar) sẽ trượt xuống hiển thị ngay phía trên ô input.
*   **Các bộ chọn nhanh trên Toolbar**:
    *   **Mức ưu tiên**: Nút dạng viên nhộng (capsule) đổi màu động theo mức chọn (High: cam-đỏ, Medium: vàng hổ phách, Low: xanh lá). Có popover chứa 3 nút chọn nhanh.
    *   **Danh mục**: Dropdown select dạng viên nhộng.
    *   **Hạn chót**: Hộp chọn ngày date-picker dạng viên nhộng.
*   **Hành vi Gửi**: Khi bấm Enter hoặc click gửi, tiêu đề sẽ được validate (không trống, tối đa 200 ký tự), task mới được tạo động chèn vào danh sách, bộ đếm task cập nhật, gửi toast thông báo và danh sách tự động cuộn xuống cuối cùng (`scrollTop = scrollHeight`).

---

## 5. Lịch sử Sửa đổi & Cập nhật UI (Revision Log)

*   **Sửa đổi 01 (05/07/2026)**:
    *   **Thanh nhập liệu thông minh (Phương án A)**: Chuyển đổi từ nút nổi "Thêm công việc" sang thanh Quick Add ở đáy.
    *   **Restructure Flex App Layout**: Khóa cuộn trình duyệt (`100vh`), đưa danh sách task `.task-list` về cơ chế tự cuộn độc lập phía trên thanh nhập liệu.
*   **Sửa đổi 02 (05/07/2026)**:
    *   **Header Full-width**: Loại bỏ `max-width` trên `.app-container` để Header trải dài hết màn hình.
    *   **Căn dọc 688px**: Gom các phần nội dung của Header, Title, Filters, Task List và Input Bar vào chung một lưới căn lề giữa.
*   **Sửa đổi 03 (05/07/2026)**:
    *   **Giảm padding Header**: Giảm padding dọc của `.app-header` xuống `8px` (`var(--space-sm)`) trên cả Desktop và Di động để giữ thanh đầu trang mảnh mai hơn.
*   **Sửa đổi 04 (05/07/2026)**:
    *   **Filter Bar Full-width**: Loại bỏ `max-width` và padding ngang trên `.app-main` (cả ở Desktop và Mobile) để thanh bộ lọc phẳng `.filter-bar` có màu nền trắng và viền dưới phủ kín 100% chiều rộng trình duyệt. Vùng nội dung bên trong bộ lọc (`.filter-bar-content`) vẫn giữ nguyên căn lề `688px` thẳng cột với danh sách task.
*   **Sửa đổi 05 (05/07/2026)**:
    *   **Sắp xếp lại vị trí Tiêu đề trang**: Di chuyển Tiêu đề trang (`.page-title-container`) xuống DƯỚI bộ lọc `.filter-bar`. Bộ lọc phẳng full-width giờ đây nằm kề sát và dính liền trực tiếp dưới Header (không có khoảng hở hay xen kẽ nền xám), tạo thành một bảng điều khiển trắng thống nhất trên cùng. Tiêu đề "Công việc của tôi" nằm tự nhiên trong vùng canvas xám ở dưới, căn dọc 688px chuẩn chỉnh với danh sách công việc.
*   **Sửa đổi 06 (05/07/2026)**:
    *   **Tìm kiếm và bộ lọc cùng hàng (Single-row filter)**: Chuyển đổi giao diện `.filter-bar-content` sang dạng flex-row nằm ngang trên 1 dòng duy nhất trên Desktop. Hộp tìm kiếm `.search-wrapper` được cố định kích thước tối đa `220px` nằm bên trái, cụm bộ lọc `.filters-row` (Tất cả/Chưa xong/Đã xong, Mức ưu tiên, Danh mục) được căn phải gọn gàng. Ẩn nhãn chữ `.filter-label` trên Desktop để tiết kiệm diện tích nhưng hiển thị lại trên Mobile để giữ cấu trúc trực quan khi xếp dọc.
*   **Sửa đổi 07 (05/07/2026)**:
    *   **Đồng bộ lề ngang của Filter Bar với Header**: Loại bỏ `max-width` trên `.filter-bar-content` để nó kéo giãn full-width. Thay vào đó, áp dụng padding ngang `32px` (`var(--space-xl)`) trên Desktop và `16px` (`var(--space-md)`) trên Mobile để các phần tử Tìm kiếm và nút Lọc gióng hàng hoàn hảo với Logo và Avatar trên Header.
    *   **Nới rộng Hộp tìm kiếm**: Tăng `max-width` của `.search-wrapper` lên `300px` để hiển thị trọn vẹn chữ placeholder *"Tìm kiếm công việc..."* mà không bị cắt chữ.
*   **Sửa đổi 08 (05/07/2026)**:
    *   **Hệ thống Responsive hai cấp (Tablet & Mobile)**: Khắc phục lỗi hộp tìm kiếm bị ép nhỏ xíu ("Q T") trên màn hình trung bình bằng cách chia nhỏ thành 2 breakpoint. Ở kích thước Tablet (`< 900px`), hộp tìm kiếm sẽ mở rộng tối đa và đẩy cụm bộ lọc xuống dòng dưới (2 dòng nằm ngang). Ở kích thước Mobile (`< 640px`), cụm bộ lọc mới chuyển hoàn toàn sang hàng dọc để phù hợp với chiều ngang điện thoại.
*   **Sửa đổi 09 (05/07/2026)**:
    *   **Cập nhật Giá trị Mặc định & Ẩn Badge tự động**: Thêm tùy chọn *"🏷️ Không có danh mục"* (`none`) làm mặc định cho cả thanh gõ nhanh Quick Add và Form Modal. 
    *   **Ẩn nhãn/hạn chót trống**: Viết lại cơ chế hiển thị task card để **không tự động hiển thị** huy hiệu danh mục và huy hiệu hạn chót nếu người dùng không chọn chúng (thay vì tự động gắn nhãn "Công việc" và "Không có hạn chót"). Việc này giúp danh sách task tối giản, sạch sẽ và chỉ chứa những thông tin thực sự cần thiết.
*   **Sửa đổi 10 (05/07/2026)**:
    *   **Sửa lỗi hiển thị đè các màn hình (Specificity bug)**: Loại bỏ `display: flex` khỏi ID selector `#view-app` to avoid specificity inheritance problems with class `.view-section { display: none }`.
*   **Sửa đổi 11 (05/07/2026)**:
    *   **Thiết kế Bộ lọc phẳng căn giữa (Flat Centered UI)**: Khắc phục khoảng trống trắng khổng lồ giữa Tìm kiếm và Lọc trên màn hình rộng bằng cách đưa cụm bộ lọc về lại lưới căn giữa `688px` (thẳng hàng dọc hoàn hảo với tiêu đề, danh sách task và ô gõ). Loại bỏ hoàn toàn nền trắng và viền ngoài của `.filter-bar`. Các nút điều khiển con (ô tìm kiếm, segmented button, select) được chuyển nền thành màu trắng tinh (`var(--color-surface)`), bo tròn mềm mại `6px` và thêm đổ bóng cực nhẹ, nổi bật độc lập trên nền ngà ấm của ứng dụng.
*   **Sửa đổi 12 (05/07/2026)**:
    *   **Dàn trang 2 dòng cho Bộ lọc phẳng căn giữa**: Giải quyết triệt để vấn đề hộp tìm kiếm bị co rút và cắt chữ placeholder ("Tìm kiếm c") ngay cả trên Desktop do không đủ không gian `688px` để hiển thị hàng ngang 1 dòng. Cấu hình `.filter-bar-content` trên Desktop thành 2 dòng: Dòng 1 là hộp tìm kiếm rộng 100% để hiển thị trọn vẹn và thoải mái chữ placeholder; Dòng 2 là cụm nút lọc (Trạng thái, Ưu tiên, Danh mục) trải dài bên dưới, tạo cảm giác thoáng đãng, cân đối và chuyên nghiệp.
*   **Sửa đổi 13 (05/07/2026)**:
    *   **Thêm khoảng cách từ Header đến Search Box**: Thay đổi `margin-top` của `.filter-bar` từ `0` thành `32px` (`var(--space-xl)`). Thay đổi này giúp đẩy thanh tìm kiếm xuống dưới, tạo một khoảng đệm trực quan thông thoáng so với đường viền dưới của Header, loại bỏ cảm giác chật chội khi tải trang.
*   **Sửa đổi 14 (05/07/2026)**:
    *   **Thu hẹp Khoảng cách giữa Ô tìm kiếm & Các nút lọc**: Giảm thuộc tính `gap` của `.filter-bar-content` từ `16px` (`var(--space-md)`) xuống còn `8px` (`var(--space-sm)`). Đồng thời giảm `margin-bottom` của `.filter-bar` từ `16px` xuống `8px` (`var(--space-sm)`) để kéo cụm bộ lọc và tiêu đề sát lại nhau hơn, mang lại bố cục chặt chẽ, gắn kết và hợp lý hơn.
*   **Sửa đổi 15 (05/07/2026)**:
    *   **Tối ưu bộ lọc trên Mobile (Ẩn nhãn phụ & Giãn rộng 100%)**: Loại bỏ hoàn toàn các nhãn chữ in hoa ("TRẠNG THÁI", "ƯU TIÊN", "DANH MỤC") bên cạnh bộ lọc trên di động/tablet. Các nhãn này khi xếp cạnh nút bấm gây chèn ép không gian khiến chữ trong segmented button bị rớt dòng ("Chưa \n xong"). Cấu hình cho tất cả các nút lọc (segmented button, dropdown select) co giãn rộng full-width (100%) trên di động để các nhãn text hiển thị thẳng hàng, rõ chữ và cân đối.
*   **Sửa đổi 16 (05/07/2026)**:
    *   **Thêm Thanh Tiến Trình (Task Progress Bar)**: Cấu trúc lại khu vực Tiêu đề trang `.page-title-container` thành dạng cột (Flex column). Thêm một hàng mới `.task-progress-container` chứa thanh ngang tiến trình mảnh cao `6px` màu xanh lá cây (`--color-success`) chuyển động mượt mà và nhãn chữ thể hiện tỷ lệ phần trăm (ví dụ: *"25% hoàn thành (1/4)"*). Viết hàm `updateTaskProgress()` và liên kết nó vào sự kiện khởi tạo trang cũng như các sự kiện cập nhật checkbox, thêm task, xóa task.
*   **Sửa đổi 17 (05/07/2026)**:
    *   **Gắn Logo Ảnh thực tế (logo.png)**: Thay thế thành phần chấm tròn CSS màu cam (`.logo-dot`) bằng thẻ ảnh thực tế `<img src="logo.png">` được người dùng cung cấp trong thư mục [ui-templates](file:///d:/Projects/tally/ui-templates). Đồng thời thêm quy tắc CSS giới hạn chiều cao ảnh ở `24px` (`width: auto`) để đảm bảo ảnh logo hiển thị sắc nét, căn giữa hoàn hảo và cân xứng trên Header.
*   **Sửa đổi 18 (05/07/2026)**:
    *   **Loại bỏ Dải Thống Kê Nhanh (Quick Statistics Strip)**: Thử nghiệm bổ sung dải thống kê dạng viên nhộng trắng dưới Header, nhưng đã loại bỏ hoàn toàn theo phản hồi từ người dùng để bảo toàn triết lý thiết kế tối giản, sạch sẽ và thoáng đãng của Tally. Khôi phục `margin-top` của `.filter-bar` về lại `32px` (`var(--space-xl)`).
*   **Sửa đổi 19 (05/07/2026)**: 
    *   **Thêm Nút Quay lại ở Auth & Điều hướng Logo**: 
        - Thêm nút *"Quay lại trang chủ"* (`.auth-back-btn`) ở đầu thẻ đăng nhập/đăng ký `auth-card`, kèm click event đưa người dùng trở lại màn hình danh sách chính `view-app`.
        - Cập nhật Logo Header (`#header-logo`) có thuộc tính `cursor: pointer` và click event quay lại trang chủ.
        - Tối ưu khoảng đệm lề ngang của `auth-card` trên di động ở mức 16px (`width: calc(100% - 32px)`) thay vì dính sát mép.
*   **Sửa đổi 20 (06/07/2026)**:
    *   **Đổi logo sang SVG (logo.svg)**: Thay thế logo ảnh PNG (`logo.png`) bằng ảnh vector SVG (`logo.svg`) trong `ui-templates/index.html` để tối ưu hóa hiển thị sắc nét trên mọi độ phân giải màn hình.










