# Hướng dẫn Setup Project FashionStore

## Cấu trúc dự án

### Frontend (Next.js App Router)
```
Frontend/
├── app/
│   ├── components/          # Components dùng chung
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── products/
│   │   ├── [slug]/
│   │   │   └── page.tsx     # Trang chi tiết sản phẩm
│   │   └── page.tsx         # Trang danh sách sản phẩm
│   ├── about/
│   │   └── page.tsx         # Trang giới thiệu
│   ├── layout.tsx           # Layout chính
│   └── page.tsx             # Trang chủ
└── pages/                   # Các trang HTML cũ (có thể giữ lại)
```

### Backend (Express + MongoDB)
```
BackEnd/
├── app.js                   # File chính, kết nối MongoDB thayHoFramework2
├── model/                   # Mongoose models
│   ├── product.js
│   ├── category.js
│   └── brand.js
├── controller/              # Controllers
│   └── product.js
├── routes/                  # API routes
│   └── products.js
└── seed-thayHoFramework2.js # Script seed data
```

## Cài đặt và chạy

### 1. Backend Setup

```bash
cd BackEnd
npm install
```

### 2. Kết nối MongoDB

Đảm bảo MongoDB đang chạy trên `localhost:27017`

Database: `thayHoFramework2`

### 3. Seed dữ liệu

```bash
cd BackEnd
node seed-thayHoFramework2.js
```

Script này sẽ:
- Tạo các Categories (Áo, Quần, Áo khoác, Váy)
- Tạo các Brands (Uniqlo, Zara, H&M)
- Tạo các Products từ `seed-data.json`

### 4. Chạy Backend Server

```bash
cd BackEnd
npm start
# hoặc
npm run dev  # với nodemon
```

Backend chạy trên: `http://localhost:3000`

### 5. Frontend Setup

```bash
cd Frontend
npm install
```

### 6. Chạy Frontend

```bash
cd Frontend
npm run dev
```

Frontend chạy trên: `http://localhost:3001` (hoặc port khác nếu 3001 đã được dùng)

## API Endpoints

### Products
- `GET /products` - Lấy tất cả sản phẩm
- `GET /products?category=Áo` - Lọc sản phẩm theo category
- `GET /products/:id` - Lấy chi tiết sản phẩm
- `POST /products` - Tạo sản phẩm mới
- `PUT /products/:id` - Cập nhật sản phẩm
- `DELETE /products/:id` - Xóa sản phẩm

## Cấu trúc Database

### Collection: products
```javascript
{
  name: String,
  price: Number,
  brand: String,
  category: String,
  category_id: ObjectId (ref: Category),
  img_url: String,
  description: String,
  variants: [{
    size: String,
    color: String,
    quantity: Number
  }]
}
```

### Collection: categories
```javascript
{
  name: String,
  description: String,
  img_url: String,
  parentId: ObjectId (ref: Category, optional)
}
```

### Collection: brands
```javascript
{
  name: String,
  description: String
}
```

## Lưu ý

1. Đảm bảo MongoDB đang chạy trước khi chạy backend
2. Database `thayHoFramework2` sẽ được tạo tự động khi seed data
3. Frontend sử dụng Next.js App Router, các route được định nghĩa trong thư mục `app/`
4. API response format: `{ success: true, data: ... }`

