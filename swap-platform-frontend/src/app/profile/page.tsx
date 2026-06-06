'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ProductList } from '@/components/ProductList';
import { FAVORITES_CHANGED_EVENT, getFavoriteProductIds, MAX_FAVORITE_PRODUCTS } from '@/lib/favorites';
import type { Product, UserProfile } from '@/lib/types';
import { getToken } from '@/lib/storage';
import { deleteProduct, fetchProducts, fetchUserProfile } from '@/services/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const token = getToken();
      if (!token) {
        setError('Please log in to view your profile.');
        setLoading(false);
        return;
      }

      try {
        const profileData = await fetchUserProfile(token);
        setProfile(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load profile.');
      } finally {
        setLoading(false);
      }

      try {
        const products = await fetchProducts();
        const favoriteIds = new Set(getFavoriteProductIds());
        setFavoriteProducts(products.filter((product) => favoriteIds.has(product.id)));
      } catch {
        setFavoriteProducts([]);
      }
    }

    loadProfile();

    window.addEventListener(FAVORITES_CHANGED_EVENT, loadProfile);
    return () => window.removeEventListener(FAVORITES_CHANGED_EVENT, loadProfile);
  }, []);

  async function handleDeleteProduct(product: Product) {
    if (!window.confirm(`確定要刪除「${product.title}」嗎？`)) return;

    const token = getToken();
    if (!token) {
      setError('請先登入。');
      return;
    }

    setDeletingProductId(product.id);
    setError('');
    try {
      await deleteProduct(token, product.id);
      setProfile((currentProfile) => currentProfile
        ? { ...currentProfile, products: currentProfile.products.filter((item) => item.id !== product.id) }
        : currentProfile);
      setFavoriteProducts((products) => products.filter((item) => item.id !== product.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : '無法刪除商品。');
    } finally {
      setDeletingProductId(null);
    }
  }

  if (loading) {
    return <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4">Loading profile...</div>;
  }

  if (error || !profile) {
    return (
      <section className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">
        <p>{error || 'Profile not found.'}</p>
        <Link href="/login" className="inline-flex rounded-2xl bg-rose-900 px-4 py-2 text-sm font-semibold text-white">
          Go to login
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 md:col-span-2">
          <p className="text-sm font-semibold text-neutral-500">Profile</p>
          <h1 className="mt-2 text-3xl font-bold text-neutral-900">{profile.name}</h1>
          <p className="mt-2 text-neutral-700">{profile.email}</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-semibold text-emerald-700">Coin balance</p>
          <p className="mt-2 text-4xl font-bold text-emerald-900">{profile.coin_balance}</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Your products</h2>
            <p className="mt-1 text-neutral-700">Items you have listed for swap.</p>
          </div>
          <Link href="/products/new" className="rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">
            Add product
          </Link>
        </div>

        {profile.products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-600">
            You have not listed any products yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {profile.products.map((product) => (
              <article key={product.id} className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-neutral-100">
                    <Image
                      src={product.image_url || '/placeholder-product.svg'}
                      alt={product.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-neutral-900">{product.title}</h3>
                    <p className="mt-1 text-sm text-neutral-600">
                      {product.category} / {product.condition} / {product.city}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-emerald-700">{product.point_price} coins</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href={`/products/detail?id=${product.id}`} className="rounded-2xl border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800">
                    View
                  </Link>
                  <Link href={`/products/edit?id=${product.id}`} className="rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(product)}
                    disabled={deletingProductId === product.id}
                    className="rounded-2xl border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60"
                  >
                    {deletingProductId === product.id ? '刪除中...' : '刪除'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">我的收藏</h2>
          <p className="mt-1 text-neutral-700">你收藏的商品會顯示在這裡，最多 {MAX_FAVORITE_PRODUCTS} 件。</p>
          <p className="mt-1 text-sm font-semibold text-emerald-700">{favoriteProducts.length} / {MAX_FAVORITE_PRODUCTS}</p>
        </div>
        <ProductList products={favoriteProducts} emptyMessage="目前還沒有收藏商品。" />
      </section>
    </div>
  );
}
