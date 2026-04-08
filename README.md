# Khách Hàng và admin UX Design – Coffee Mocha

## 1. Overview
Website cho phép khách hàng khám phá menu, tìm kiếm đồ uống .  

Mục tiêu:  
• Tăng trải nghiệm người dùng  
• Giúp khách dễ tìm món  
• Trải nghiệm cảm giác dễ dàng  

---

## 2. Target Users
• Người trẻ và người trẻ  
• Khách hàng yêu thích cà phê  
• Người muốn đặt đồ không cần gọi tại quầy  

---

## 3. Main Features
• Tìm kiếm đồ uống  
• Xem menu theo danh mục  
• Thêm vào giỏ hàng  
• Xem giỏ hàng  
• Đặt hàng  

---

## 4. Cấu trúc

### 4.1 Trang Chủ

#### Hero Section
• Background: hình ảnh quán cà phê (tạo cảm xúc)  
• Title: "Khám Phá Cà Phê Hoàn Hảo"  
• Search bar (trung tâm)  

**UX Decision:**  
• Đặt search ở trung tâm để user tìm nhanh  
• Hình ảnh tạo cảm giác thư giãn → giữ user lâu hơn  

---

### 4.2 Category Menu (Bên trái)

Danh mục:  
• Mùa Xuân  
• Mùa Hạ  
• Mùa Thu  
• Mùa Đông  

**UX Decision:**  
• Dùng icon + màu sắc để phân biệt  
• Giúp user khám phá menu theo chủ đề  

---

### 4.3 Product Display

Hiển thị:  
• Tên món  
• Giá  
• Trạng thái (đang chờ/hoàn thành)  

**UX Decision:**  
• Hiển thị rõ ràng để user quyết định nhanh  
• Tránh overload thông tin  

---

### 4.4 Search Function

• Nhập tên đồ uống  
• Hiển thị kết quả ngay lập tức  

**UX Decision:**  
• Giảm thời gian tìm kiếm  
• Tăng trải nghiệm nhanh chóng  

---

### 4.5 Cart (Bên phải)

Icon giỏ hàng:  
• Click để mở giỏ  

Hiển thị:  
• Danh sách món đã chọn  
• Tổng tiền  

**UX Decision:**  
• Icon nổi để dễ thấy  
• Giữ giỏ hàng luôn accessible  

---

### 4.6 User Profile

Icon user:  
• Đăng nhập / đăng xuất  
• Xem lịch sử đơn hàng  

---

### 4.7 Admin Dashboard (Giao diện Quản trị)

Giao diện dành riêng cho chủ quán để điều phối vận hành và kiểm soát dữ liệu hệ thống.  
Hệ thống quản lý Database hiển thị thông tin người dùng  

#### Các tính năng chính (Main Features)
• Đăng nhập hệ thống: Xác thực quyền truy cập bảo mật dành cho quản lý.  
• Xem Danh sách Đơn hàng: Theo dõi tất cả các yêu cầu đặt hàng từ khách hàng  
• Duyệt & Cập nhật Trạng thái: Chuyển đổi trạng thái đơn hàng (Ví dụ: Chờ duyệt → Đang chuẩn bị → Đã hoàn thành).  
• Quản lý Menu: (Đề xuất thêm) chọn món trên menu , giá cả hiện có .  

---

## Cấu trúc UI Admin

### Trang Quản lý Đơn hàng

• Bảng điều khiển (Order Table):  
  o Hiển thị ID đơn hàng, tên sản phẩm và tổng tiền.  
  o Trạng thái màu sắc: Sử dụng nhãn (label) màu cam cho "Chờ duyệt" và màu xanh cho "Hoàn thành" để quản lý dễ nhận diện.  

• Nút tác vụ (Action Buttons):  
  o Nút "Duyệt đơn" nổi bật để xử lý nhanh.  

**UX Decision:**  
• Tính cập nhật: Danh sách đơn hàng và có hiện thông báo khi có đơn mới để Admin không bỏ lỡ khách.  
• Tập trung vào hiệu suất: Thiết kế dạng bảng tối giản, hiển thị đầy đủ thông tin quan trọng trên một màn hình để giảm thao tác cuộn/click.  

---

## Luồng công việc của Admin (Admin User Flow)

1. Đăng nhập vào hệ thống quản trị.  
2. Truy cập Danh sách đơn hàng để kiểm tra các yêu cầu mới nhất.  
3. Kiểm tra chi tiết món ăn của khách hàng.  
4. Xác nhận đơn hàng và cập nhật trạng thái để thông báo cho khách.  
5. (Tùy chọn) Chỉnh sửa menu nếu có thay đổi món hoặc giá cả.  

---

## Nguyên tắc UX cho Admin (Applied Principles)

• Efficiency (Hiệu suất): Tối ưu hóa quy trình duyệt đơn để món ăn được chuẩn bị nhanh nhất có thể.  
• Control (Sự kiểm soát): Admin có quyền can thiệp vào trạng thái đơn hàng .  
• Consistency (Sự thống nhất): Sử dụng chung hệ thống biểu tượng và tông màu với giao diện khách hàng để tạo sự đồng bộ cho thương hiệu "Macho Coffee".  

---

## 5. User Flow

User vào web → Tìm kiếm hoặc chọn danh mục → Xem món → Thêm vào giỏ hàng → Mở giỏ hàng → Xác nhận đặt hàng  

---

## 6. UX Improvements (Đề xuất nâng cấp)

• Thêm:  
  o Bộ lọc (giá, loại)  
  o Đánh giá sản phẩm  
  o Gợi ý món (recommendation)  
  o Hiển thị món hot  

• Fix:  
  o Thông báo "quán chưa có món này" → nên thân thiện hơn  
  o Thêm loading khi search  

---

## 7. Future Development

• Tích hợp thanh toán online  
• Lưu đơn hàng  
• Cá nhân hóa trải nghiệm  
