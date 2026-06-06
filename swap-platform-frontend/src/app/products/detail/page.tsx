'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Product, SellerContact } from '@/lib/types';
import { isFavoriteProduct, toggleFavoriteProduct } from '@/lib/favorites';
import { getCurrentUserId, getToken } from '@/lib/storage';
import { deleteProduct, fetchProduct, fetchSellerContact } from '@/services/api';

function ProductDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = Number(searchParams.get('id'));
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [sellerContact, setSellerContact] = useState<SellerContact | null>(null);
  const [loadingContact, setLoadingContact] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!Number.isInteger(productId) || productId <= 0) {
        setError('Invalid product id.');
        setLoading(false);
        return;
      }

      try {
        const data = await fetchProduct(productId);
        setProduct(data);
        setIsFavorite(isFavoriteProduct(productId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load product.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
    setCurrentUserId(getCurrentUserId());
  }, [productId]);

  if (loading) {
    return <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4">Loading product...</div>;
  }

  if (error || !product) {
    return (
      <section className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">
        <p>{error || 'Product not found.'}</p>
        <Link href="/products" className="inline-flex font-semibold text-rose-900">
          Back to products
        </Link>
      </section>
    );
  }

  const imageSrc = product.image_url || '/placeholder-product.svg';

  function handleFavorite() {
    if (!product) return;

    if (!getToken()) {
      setFavoriteMessage('請先登入才能收藏商品。');
      return;
    }

    try {
      const nextIsFavorite = toggleFavoriteProduct(product.id);
      setIsFavorite(nextIsFavorite);
      setFavoriteMessage(nextIsFavorite ? '已加入我的收藏。' : '已取消收藏。');
    } catch (err) {
      setFavoriteMessage(err instanceof Error ? err.message : '無法收藏商品。');
    }
  }

  async function handleDelete() {
    if (!product || !window.confirm(`確定要刪除「${product.title}」嗎？`)) return;

    const token = getToken();
    if (!token) return;

    setDeleting(true);
    setError('');
    try {
      await deleteProduct(token, product.id);
      router.push('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : '無法刪除商品。');
      setDeleting(false);
    }
  }

  async function handleContactSeller() {
    if (!product) return;

    const token = getToken();
    if (!token) {
      setContactMessage('請先登入才能聯絡賣家。');
      return;
    }

    setLoadingContact(true);
    setContactMessage('');
    try {
      setSellerContact(await fetchSellerContact(token, product.id));
    } catch (err) {
      setContactMessage(err instanceof Error ? err.message : '無法取得賣家聯絡方式。');
    } finally {
      setLoadingContact(false);
    }
  }

  return (
    <article className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative min-h-[360px] overflow-hidden rounded-2xl bg-neutral-100">
        <Image src={imageSrc} alt={product.title} fill className="object-cover" />
      </div>

      <section className="space-y-6">
        <Link href="/products" className="text-sm font-semibold text-emerald-700">
          Back to products
        </Link>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-neutral-900">{product.title}</h1>
          <p className="text-lg leading-8 text-neutral-700">{product.description}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <DetailItem label="Points" value={String(product.point_price)} />
          <DetailItem label="Category" value={product.category} />
          <DetailItem label="Condition" value={product.condition} />
          <DetailItem label="City" value={product.city} />
        </div>

        {currentUserId !== product.owner_id ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleFavorite}
              className={isFavorite
                ? 'rounded-2xl border border-rose-300 bg-rose-50 px-5 py-3 font-semibold text-rose-700'
                : 'rounded-2xl bg-neutral-900 px-5 py-3 font-semibold text-white'}
            >
              {isFavorite ? '取消收藏' : '收藏商品'}
            </button>
            {favoriteMessage ? <p className="text-sm text-neutral-600">{favoriteMessage}</p> : null}
          </div>
        ) : null}

        {currentUserId !== product.owner_id ? (
          <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <h2 className="text-lg font-bold text-emerald-900">交換與聯絡</h2>
            <button
              type="button"
              onClick={handleContactSeller}
              disabled={loadingContact}
              className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white disabled:opacity-60"
            >
              {loadingContact ? '取得聯絡方式中...' : '我要交換／聯絡賣家'}
            </button>
            {contactMessage ? <p className="text-sm text-rose-700">{contactMessage}</p> : null}
            {sellerContact ? (
              <div className="space-y-2 text-neutral-700">
                <p>賣家：{sellerContact.name}</p>
                <p>Email：{sellerContact.email}</p>
                <a
                  href={`mailto:${sellerContact.email}?subject=${encodeURIComponent(`想交換商品：${product.title}`)}`}
                  className="inline-flex rounded-2xl border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-800"
                >
                  寄 Email 給賣家
                </a>
              </div>
            ) : null}
          </div>
        ) : null}

        {currentUserId === product.owner_id ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-2xl border border-rose-300 px-5 py-3 font-semibold text-rose-700 disabled:opacity-60"
          >
            {deleting ? '刪除中...' : '刪除商品'}
          </button>
        ) : null}
      </section>
    </article>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <dt className="text-sm font-semibold text-neutral-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-neutral-900">{value}</dd>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4">Loading product...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
