# swap-platform-backend

FastAPI 後端專案，對應 DigitalOcean App Platform Web Service。

## 1. 安裝與啟動

```bash
python -m venv .venv
source .venv/bin/activate  # Windows 請改用 .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python scripts/seed.py
uvicorn app.main:app --reload
```

API 啟動後：

- Health Check: `http://localhost:8000/health`
- Swagger: `http://localhost:8000/docs`

## 2. 主要 API

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/products`
- `POST /api/v1/products`（需要 Bearer Token）

## 3. Managed PostgreSQL

請把 `.env` 裡的 `DATABASE_URL` 換成 DigitalOcean Managed PostgreSQL 的連線字串。

## 4. App Platform

- Build Command: `pip install -r requirements.txt && alembic upgrade head`
- Run Command: `uvicorn app.main:app --host 0.0.0.0 --port 8080`
- HTTP Port: `8080`

## 5. Demo 測試資料

執行 `python scripts/seed.py` 後會建立：

- 帳號：`demo@example.com`
- 密碼：`password123`
