# Hướng dẫn chạy ứng dụng

## Yêu cầu hệ thống
- Node.js (v14 trở lên)
- MongoDB đang chạy trên `localhost:27017`
- Database `thayHoFramework2` đã được tạo và có dữ liệu

## Các bước chạy ứng dụng

### 1. Chạy Backend (Port 3001)

```bash
cd BackEnd
npm install  # Nếu chưa cài đặt dependencies
npm start
```

Backend sẽ chạy trên: `http://localhost:3001`

**Kiểm tra:**
- Mở browser: `http://localhost:3001/products` - phải trả về danh sách sản phẩm
- Mở browser: `http://localhost:3001/categories` - phải trả về danh sách categories

### 2. Chạy Frontend (Port 3000)

Mở terminal mới:

```bash
cd Frontend
npm install  # Nếu chưa cài đặt dependencies
npm run dev
```

Frontend sẽ chạy trên: `http://localhost:3000`

## Kiểm tra kết nối

1. **Kiểm tra Backend:**
   - Truy cập: `http://localhost:3001/products`
   - Phải thấy JSON response với danh sách sản phẩm

2. **Kiểm tra Frontend:**
   - Truy cập: `http://localhost:3000`
   - Phải thấy trang chủ với sản phẩm nổi bật
   - Mở Developer Console (F12) để xem lỗi nếu có

## Xử lý lỗi

### Lỗi: "Không tìm thấy sản phẩm nào"
- **Nguyên nhân:** Backend chưa chạy hoặc không kết nối được
- **Giải pháp:** 
  1. Kiểm tra backend có đang chạy trên port 3001 không
  2. Kiểm tra MongoDB có đang chạy không
  3. Kiểm tra database `thayHoFramework2` có dữ liệu không

### Lỗi: "Cannot connect to backend"
- **Nguyên nhân:** Backend không chạy hoặc port sai
- **Giải pháp:**
  1. Chạy backend: `cd BackEnd && npm start`
  2. Kiểm tra console log xem backend có chạy thành công không
  3. Kiểm tra port 3001 có bị chiếm dụng không

### Lỗi: "Kết nối DB thất bại"
- **Nguyên nhân:** MongoDB chưa chạy hoặc database không tồn tại
- **Giải pháp:**
  1. Khởi động MongoDB service
  2. Tạo database `thayHoFramework2` nếu chưa có
  3. Chạy script seed data nếu cần: `cd BackEnd && node seed-thayHoFramework2.js`

## Cấu hình Port

- **Backend:** Port 3001 (cấu hình trong `BackEnd/bin/www`)
- **Frontend:** Port 3000 (Next.js default)
- **API Base URL:** `http://localhost:3001` (cấu hình trong `Frontend/app/utils/constants.ts`)

## Database

- **Database name:** `thayHoFramework2`
- **Connection string:** `mongodb://localhost:27017/thayHoFramework2`
- **Collections:** `products`, `categories`

