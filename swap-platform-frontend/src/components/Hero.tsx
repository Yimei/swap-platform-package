import Link from 'next/link';

export function Hero() {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-emerald-100 via-white to-lime-100 p-8 shadow-sm md:p-12">
      <div className="max-w-3xl space-y-5">
        <span className="inline-flex rounded-full bg-emerald-600 px-3 py-1 text-sm font-semibold text-white">
          母嬰與家庭物品點數交換平台
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
          讓閒置物品重新流動，用點數交換你真正需要的東西。
        </h1>
        <p className="text-lg leading-8 text-neutral-700">
          前端使用 Next.js，後端使用 FastAPI，資料庫使用 PostgreSQL。這份專案已預留圖片外部儲存欄位 image_url，方便日後接 S3、Spaces 或 CDN。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/products"
            className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            查看商品
          </Link>
          <a
            href="#features"
            className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400"
          >
            了解功能
          </a>
        </div>
      </div>
    </section>
  );
}
