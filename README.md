# 換換看｜完整前後端 MVP

這是一個以 **永續交換 / 二手循環 / 點數制** 為核心的全端範例專案。

## 技術選型

- 前端：React + Vite
- 後端：Node.js + Express
- 資料庫：SQLite
- 驗證：JWT
- 視覺風格：綠色系、永續環保、柔和卡片式介面

---

## 目前功能

### 前端
- 首頁 Hero 區塊
- 商品市集列表
- 類別篩選 / 關鍵字搜尋
- 註冊 / 登入
- 上架商品
- 收藏商品
- 建立交換訂單
- 我的交換 / 點數紀錄 / 個人資訊

### 後端
- 使用者註冊 / 登入
- JWT 驗證
- 商品 CRUD（目前提供列表與新增）
- 收藏切換
- 建立交換訂單
- 賣家更新訂單狀態
- 完成交換後自動進行點數轉移
- 點數流水查詢
- 首頁統計資料

---

## 專案結構

```bash
huanhuankan/
├─ backend/
│  ├─ package.json
│  ├─ .env.example
│  └─ src/
│     ├─ auth.js
│     ├─ db.js
│     ├─ initDb.js
│     └─ server.js
├─ frontend/
│  ├─ package.json
│  ├─ index.html
│  ├─ vite.config.js
│  └─ src/
│     ├─ api.js
│     ├─ App.jsx
│     ├─ main.jsx
│     └─ styles.css
└─ README.md
```

---

## 啟動方式

### 1. 後端

```bash
cd backend
npm install
cp .env.example .env
npm run init-db
npm run dev
```

後端預設會跑在：

```bash
http://localhost:4000
```

### 2. 前端

```bash
cd frontend
npm install
npm run dev
```

前端預設會跑在：

```bash
http://localhost:5173
```

---

## 測試帳號

資料庫初始化後，預設會建立兩個測試帳號。

```text
green@example.com / 123456
forest@example.com / 123456
```

---

## 後續建議擴充

1. 圖片上傳改成物件儲存（S3 / Cloudinary）
2. 加入超商物流 / 面交選項
3. 增加聊天與通知
4. 增加管理後台
5. 實作評價系統
6. 點數規則防濫用與風控
7. 串接金流，用於點數包、服務費、廣告位
8. 被動上架排序與推薦邏輯
9. 法務頁：使用者條款 / 點數制度條款 / 退換爭議流程
10. 手機版 UX 強化與 PWA

---

## 補充

這份程式碼是 **可直接啟動的 MVP 基礎版**，適合先做品牌原型、功能驗證、Demo 展示。
若你下一步要，我可以再幫你往下拆成：

- 完整資料庫 schema 版
- 管理後台版
- 串物流版
- 串 LINE Login 版
- 部署版（Vercel + Render / VPS / Docker）
