'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import { fetchProducts } from '@/services/api';
import { ProductList } from '@/components/ProductList';
import { AUTH_CHANGED_EVENT, getCurrentUserId } from '@/lib/storage';

export function HomeProductSearch() {
  const [products, setProducts] = useState<Product[]>([]);
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setProducts(await fetchProducts());
      } catch (err) {
        setError(err instanceof Error ? err.message : '無法取得商品。');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();

    function syncCurrentUser() {
      setCurrentUserId(getCurrentUserId());
    }

    syncCurrentUser();
    window.addEventListener(AUTH_CHANGED_EVENT, syncCurrentUser);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, syncCurrentUser);
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase();
    const otherUsersProducts = currentUserId ? products.filter((product) => product.owner_id !== currentUserId) : products;
    if (!keyword) return otherUsersProducts;

    return otherUsersProducts.filter((product) =>
      [product.title, product.description, product.category, product.condition, product.city]
        .some((value) => value.toLocaleLowerCase().includes(keyword)),
    );
  }, [currentUserId, products, query]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery(input);
  }

  function clearSearch() {
    setInput('');
    setQuery('');
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-neutral-900">搜尋商品</h2>
        <p className="text-neutral-700">輸入商品名稱、分類、城市或商品狀況。</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row">
        <input
          type="search"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="例如：嬰兒推車、童書、台北市"
          className="min-w-0 flex-1 rounded-2xl border border-neutral-300 px-4 py-3 outline-none focus:border-emerald-600"
        />
        <button className="rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700">
          搜尋
        </button>
        {query ? (
          <button type="button" onClick={clearSearch} className="rounded-2xl border border-neutral-300 px-5 py-3 font-semibold text-neutral-700 hover:bg-neutral-100">
            清除
          </button>
        ) : null}
      </form>

      {query ? (
        <p className="text-sm text-neutral-600">
          「{query}」找到 {filteredProducts.length} 項商品
        </p>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-neutral-700">商品載入中...</div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">讀取商品失敗：{error}</div>
      ) : (
        <ProductList products={filteredProducts} emptyMessage={query ? `找不到符合「${query}」的商品。` : undefined} />
      )}
    </section>
  );
}
