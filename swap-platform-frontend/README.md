# swap-platform-frontend

Next.js 前端專案，對應 DigitalOcean Static Site。

## 1. 安裝

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 2. 環境變數

`.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

正式環境請改成：

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yoursite.com
```

## 3. 頁面

- `/`：首頁，含註冊 / 登入 / 快速建立商品測試區
- `/products`：商品列表頁

## 4. DigitalOcean Static Site

- Build Command: `npm install && npm run build`
- Output Directory: `out`
- Environment Variable: `NEXT_PUBLIC_API_BASE_URL=https://api.yoursite.com`
