'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import type { WishlistItem } from '@/lib/types';
import { getToken } from '@/lib/storage';
import { createWishlistItem, deleteWishlistItem, fetchWishlistItems } from '@/services/api';

const MAX_WISHLIST_ITEMS = 10;

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [itemName, setItemName] = useState('');
  const [desiredPointPrice, setDesiredPointPrice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadWishlist() {
    const token = getToken();
    if (!token) {
      setError('請先登入才能查看願望清單。');
      setLoading(false);
      return;
    }

    try {
      const data = await fetchWishlistItems(token);
      setItems(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '無法載入願望清單。');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWishlist();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getToken();
    if (!token) {
      setError('請先登入才能新增願望。');
      return;
    }

    const pointPrice = Number(desiredPointPrice);
    if (!itemName.trim() || Number.isNaN(pointPrice) || pointPrice < 0) {
      setError('請填寫項目名稱與有效的價格點數。');
      return;
    }

    if (items.length >= MAX_WISHLIST_ITEMS) {
      setError('願望清單最多只能有 10 樣。');
      return;
    }

    setSaving(true);
    try {
      const createdItem = await createWishlistItem(token, {
        item_name: itemName.trim(),
        desired_point_price: pointPrice,
      });
      setItems((currentItems) => [createdItem, ...currentItems]);
      setItemName('');
      setDesiredPointPrice('');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '無法新增願望。');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(itemId: number) {
    const token = getToken();
    if (!token) return;

    setDeletingId(itemId);
    try {
      await deleteWishlistItem(token, itemId);
      setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '無法刪除願望。');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4">載入願望清單中...</div>;
  }

  if (error && items.length === 0 && !getToken()) {
    return (
      <section className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">
        <p>{error}</p>
        <Link href="/login" className="inline-flex rounded-2xl bg-rose-900 px-4 py-2 text-sm font-semibold text-white">
          前往登入
        </Link>
      </section>
    );
  }

  const isFull = items.length >= MAX_WISHLIST_ITEMS;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Wishlist</p>
          <h1 className="mt-1 text-3xl font-bold text-neutral-900">願望清單</h1>
          <p className="mt-2 text-neutral-700">每個帳號最多可以保存 10 樣想交換的項目。</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700">
          {items.length} / {MAX_WISHLIST_ITEMS}
        </div>
      </section>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-5 md:grid-cols-[1fr_180px_auto] md:items-end">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-neutral-700">項目</span>
          <input
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
            disabled={isFull || saving}
            maxLength={150}
            className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-neutral-900 outline-none focus:border-emerald-600"
            placeholder="例如：機械鍵盤、相機鏡頭"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-neutral-700">希望價格點數</span>
          <input
            value={desiredPointPrice}
            onChange={(event) => setDesiredPointPrice(event.target.value)}
            disabled={isFull || saving}
            min={0}
            type="number"
            className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-neutral-900 outline-none focus:border-emerald-600"
            placeholder="點數"
          />
        </label>

        <button
          type="submit"
          disabled={isFull || saving}
          className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-neutral-400"
        >
          {saving ? '新增中...' : '新增'}
        </button>
      </form>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">{error}</div> : null}

      {isFull ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800">
          已達 10 樣上限，刪除既有項目後才能新增。
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-600">
          目前還沒有願望項目。
        </div>
      ) : (
        <section className="grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">{item.item_name}</h2>
                <p className="mt-1 text-sm font-semibold text-emerald-700">{item.desired_point_price} 點</p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="rounded-2xl border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 disabled:cursor-not-allowed disabled:text-neutral-400"
              >
                {deletingId === item.id ? '刪除中...' : '刪除'}
              </button>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
