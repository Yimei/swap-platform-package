'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Product } from '@/lib/types';
import { fetchProduct } from '@/services/api';

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const productId = Number(searchParams.get('id'));
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load product.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
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

  const imageUrls = product.image_urls?.length ? product.image_urls : product.image_url ? [product.image_url] : [];
  const imageSrc = imageUrls[0] || '/placeholder-product.svg';

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

        {imageUrls.length > 1 ? (
          <div className="grid grid-cols-3 gap-3">
            {imageUrls.slice(1).map((url) => (
              <div key={url} className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
                <Image src={url} alt={product.title} fill className="object-cover" />
              </div>
            ))}
          </div>
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
