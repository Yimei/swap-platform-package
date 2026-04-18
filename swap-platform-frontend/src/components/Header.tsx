import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-emerald-700">
          換換看 Swap Platform
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-neutral-700">
          <Link href="/">首頁</Link>
          <Link href="/products">商品列表</Link>
        </nav>
      </div>
    </header>
  );
}
