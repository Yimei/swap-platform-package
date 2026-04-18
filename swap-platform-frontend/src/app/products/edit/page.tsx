'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Product } from '@/lib/types';
import { getToken } from '@/lib/storage';
import { fetchProduct, updateProduct } from '@/services/api';

type ProductForm = {
  title: string;
  description: string;
  category: string;
  point_price: number;
  condition: string;
  city: string;
  image_url: string;
};

const emptyForm: ProductForm = {
  title: '',
  description: '',
  category: '',
  point_price: 0,
  condition: '',
  city: '',
  image_url: '',
};

function toForm(product: Product): ProductForm {
  return {
    title: product.title,
    description: product.description,
    category: product.category,
    point_price: product.point_price,
    condition: product.condition,
    city: product.city,
    image_url: product.image_url || '',
  };
}

function ProductEditContent() {
  const searchParams = useSearchParams();
  const productId = Number(searchParams.get('id'));
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!Number.isInteger(productId) || productId <= 0) {
        setError('Invalid product id.');
        setLoading(false);
        return;
      }

      try {
        const product = await fetchProduct(productId);
        setForm(toForm(product));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load product.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    const token = getToken();
    if (!token) {
      setError('Please log in before editing a product.');
      return;
    }

    setSaving(true);
    try {
      await updateProduct(token, productId, {
        ...form,
        image_url: form.image_url || undefined,
      });
      setMessage('Product updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update product.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4">Loading product...</div>;
  }

  if (error && !form.title) {
    return (
      <section className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">
        <p>{error}</p>
        <Link href="/profile" className="inline-flex rounded-2xl bg-rose-900 px-4 py-2 text-sm font-semibold text-white">
          Back to profile
        </Link>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-5 rounded-2xl border border-neutral-200 bg-white p-6">
      <div>
        <Link href="/profile" className="text-sm font-semibold text-emerald-700">
          Back to profile
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-neutral-900">Edit product</h1>
      </div>

      {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      {message ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}

      <input className="w-full rounded-2xl border border-neutral-300 px-4 py-3" placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
      <textarea className="min-h-32 w-full rounded-2xl border border-neutral-300 px-4 py-3" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />

      <div className="grid gap-4 md:grid-cols-2">
        <input className="rounded-2xl border border-neutral-300 px-4 py-3" placeholder="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required />
        <input className="rounded-2xl border border-neutral-300 px-4 py-3" placeholder="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} required />
        <input className="rounded-2xl border border-neutral-300 px-4 py-3" placeholder="Condition" value={form.condition} onChange={(event) => setForm({ ...form, condition: event.target.value })} required />
        <input className="rounded-2xl border border-neutral-300 px-4 py-3" placeholder="Point price" type="number" min="0" value={form.point_price} onChange={(event) => setForm({ ...form, point_price: Number(event.target.value) })} required />
      </div>

      <input className="w-full rounded-2xl border border-neutral-300 px-4 py-3" placeholder="Image URL" value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} />

      <button disabled={saving} className="rounded-2xl bg-neutral-900 px-5 py-3 font-semibold text-white disabled:opacity-60">
        {saving ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  );
}

export default function ProductEditPage() {
  return (
    <Suspense fallback={<div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4">Loading product...</div>}>
      <ProductEditContent />
    </Suspense>
  );
}
