'use client';

import { useEffect, useState } from 'react';
import { ProductList } from '@/components/ProductList';
import type { Product } from '@/lib/types';
import { AUTH_CHANGED_EVENT, getCurrentUserId } from '@/lib/storage';
import { fetchProducts } from '@/services/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '無法取得商品');
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

  const visibleProducts = currentUserId ? products.filter((product) => product.owner_id !== currentUserId) : products;

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-neutral-900">商品列表</h1>
        <p className="text-neutral-700">此頁會直接呼叫 FastAPI 的 /api/v1/products。</p>
      </section>

      {loading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-neutral-700">
          商品載入中...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">
          讀取商品失敗：{error}
        </div>
      ) : (
        <ProductList products={visibleProducts} emptyMessage="目前沒有其他使用者的商品。" />
      )}
    </div>
  );
}
