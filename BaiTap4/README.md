# BaiTap4 - Metro Ticket Auth API

## Run

1. Copy env:
   - Copy `.env.example` to `.env`
2. Install:
   - `npm install`
3. Start:
   - `npm run dev`

## Test

- `npm test`
- Mac dinh test ket noi DB local: `mongodb://127.0.0.1:27017/node_auth_test`
- Co the doi bang bien moi truong:
  - PowerShell: `$env:TEST_MONGO_URI="mongodb://127.0.0.1:27017/node_auth_test"; npm test`

## Role-specific endpoints

- `POST /api/metro/tickets/:ticketCode/validate-entry` -> `staff`, `admin`
- `POST /api/metro/tickets/:ticketCode/manual-inspection` -> `inspector`, `admin`
