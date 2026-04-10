# Bài Tập 5 - Metro Ticket Advanced API + Realtime

Đây là backend Node.js mở rộng từ `BaiTap4`, tập trung vào các kỹ thuật nâng cao:

- Validation schema bằng `Joi`
- Rate limit in-memory
- `Idempotency-Key` cho API tạo báo cáo
- Realtime bằng `Socket.IO` theo vai trò người dùng
- `worker_threads` cho tác vụ xử lý báo cáo
- Tải báo cáo CSV theo dạng stream

## Khởi động nhanh

1. Tạo file môi trường:
   - Copy `.env.example` thành `.env`
2. Cài đặt dependencies:
   - `npm install`
3. Chạy ứng dụng:
   - `npm run dev`
4. Chạy test:
   - `npm test`
   - Mặc định test kết nối DB local: `mongodb://127.0.0.1:27017/node_auth_test`
   - Có thể đổi bằng biến môi trường:
     - PowerShell: `$env:TEST_MONGO_URI="mongodb://127.0.0.1:27017/node_auth_test"; npm test`

## Nhóm API chính

- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/refresh-token`
  - `POST /api/auth/logout`
- User:
  - `GET /api/users/me`
  - `GET /api/users` (admin, có pagination/filter/sort)
  - `PATCH /api/users/:id/role` (admin)
- Metro:
  - `POST /api/metro/tickets/:ticketCode/validate-entry` -> `staff`, `admin`
  - `POST /api/metro/tickets/:ticketCode/manual-inspection` -> `inspector`, `admin`
- Report:
  - `POST /api/reports` (admin, bắt buộc header `Idempotency-Key`)
  - `GET /api/reports`
  - `GET /api/reports/:id`
  - `GET /api/reports/:id/download`

## Sự kiện realtime

- `metro.ticket.entryValidated`
- `metro.ticket.manualInspectionCreated`
- `report.created`
- `report.statusChanged`

## Tài liệu đi kèm

- Mô tả bài tập chi tiết: `baitap5.md`
- Giải thích riêng về Idempotency-Key: `idempotency-key-approach.md`
