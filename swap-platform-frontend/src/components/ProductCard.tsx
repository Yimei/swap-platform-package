'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FAVORITES_CHANGED_EVENT, isFavoriteProduct, toggleFavoriteProduct } from '@/lib/favorites';
import { getCurrentUserId, getToken } from '@/lib/storage';
import type { Product } from '@/lib/types';

export function ProductCard({ product }: { product: Product }) {
  const imageSrc = product.image_url || '/placeholder-product.svg';
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState('');

  useEffect(() => {
    function syncFavorite() {
      setIsFavorite(isFavoriteProduct(product.id));
    }

    syncFavorite();
    window.addEventListener(FAVORITES_CHANGED_EVENT, syncFavorite);
    return () => window.removeEventListener(FAVORITES_CHANGED_EVENT, syncFavorite);
  }, [product.id]);

  function handleFavorite() {
    if (!getToken()) {
      setFavoriteMessage('請先登入才能收藏商品。');
      return;
    }

    try {
      const nextIsFavorite = toggleFavoriteProduct(product.id);
      setIsFavorite(nextIsFavorite);
      setFavoriteMessage(nextIsFavorite ? '已加入收藏。' : '已取消收藏。');
    } catch (err) {
      setFavoriteMessage(err instanceof Error ? err.message : '無法收藏商品。');
    }
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-56 w-full bg-neutral-100">
        <Image src={imageSrc} alt={product.title} fill className="object-cover" />
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-neutral-900">
            <Link href={`/products/detail?id=${product.id}`} className="hover:text-emerald-700">
              {product.title}
            </Link>
          </h3>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            {product.point_price} 點
          </span>
        </div>
        <p className="line-clamp-3 min-h-[72px] text-sm leading-6 text-neutral-700">{product.description}</p>
        <div className="flex flex-wrap gap-2 text-sm text-neutral-600">
          <span className="rounded-full bg-neutral-100 px-3 py-1">{product.category}</span>
          <span className="rounded-full bg-neutral-100 px-3 py-1">{product.condition}</span>
          <span className="rounded-full bg-neutral-100 px-3 py-1">{product.city}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/products/detail?id=${product.id}`}
            className="inline-flex rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
          >
            View details
          </Link>
          {getCurrentUserId() !== product.owner_id ? (
            <button
              type="button"
              onClick={handleFavorite}
              className={isFavorite
                ? 'rounded-2xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700'
                : 'rounded-2xl border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700'}
            >
              {isFavorite ? '取消收藏' : '收藏'}
            </button>
          ) : null}
        </div>
        {favoriteMessage ? <p className="text-sm text-neutral-600">{favoriteMessage}</p> : null}
      </div>
    </article>
  );
}
