const features = [
  {
    title: '商品列表頁',
    description: '可直接從後端 API 抓取商品，支援點數價格、商品狀態、城市與圖片欄位。',
  },
  {
    title: 'JWT 驗證基礎',
    description: '已內建註冊、登入、Token 儲存與建立商品 API 範例，方便後續擴充會員中心。',
  },
  {
    title: 'DigitalOcean 友善',
    description: '前端可輸出靜態站部署到 Static Site，後端可直接部署到 App Platform。',
  },
  {
    title: 'Managed PostgreSQL',
    description: '資料表已設計完成，並包含 Alembic migration，啟動後即可建立基本資料。',
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="grid gap-5 md:grid-cols-2">
      {features.map((feature) => (
        <article key={feature.title} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-neutral-900">{feature.title}</h3>
          <p className="mt-3 leading-7 text-neutral-700">{feature.description}</p>
        </article>
      ))}
    </section>
  );
}
