'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ClipboardEvent, Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Product } from '@/lib/types';
import { getToken } from '@/lib/storage';
import { fetchProduct, updateProduct, uploadProductImage } from '@/services/api';

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
  const [uploading, setUploading] = useState(false);

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

  async function uploadImage(image: File) {
    const token = getToken();
    if (!token) {
      setError('請先登入才能上傳照片。');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');
    try {
      const result = await uploadProductImage(token, image);
      setForm((currentForm) => ({ ...currentForm, image_url: result.image_url }));
      setMessage('照片上傳成功，請儲存變更。');
    } catch (err) {
      setError(err instanceof Error ? err.message : '無法上傳照片。');
    } finally {
      setUploading(false);
    }
  }

  async function handleImageFile(event: React.ChangeEvent<HTMLInputElement>) {
    const image = event.target.files?.[0];
    if (!image) return;

    try {
      await uploadImage(image);
    } finally {
      event.target.value = '';
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const imageItem = Array.from(event.clipboardData.items).find((item) => item.type.startsWith('image/'));
    const image = imageItem?.getAsFile();

    if (!image) {
      setError('剪貼簿中沒有可上傳的圖片。');
      return;
    }

    event.preventDefault();
    void uploadImage(image);
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

      <div onPaste={handlePaste} tabIndex={0} className="space-y-3 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-4 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
        <span className="block text-sm font-semibold text-neutral-700">從電腦選擇照片，或點擊此區域後按 Ctrl+V 貼上圖片</span>
        <span className="block text-sm text-neutral-500">支援 JPEG、PNG、WebP、GIF，最大 5MB。</span>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageFile} disabled={uploading || saving} className="block w-full text-sm text-neutral-700" />
        {uploading ? <span className="block text-sm text-emerald-700">照片上傳中...</span> : null}
      </div>

      {form.image_url ? (
        <div className="relative h-64 overflow-hidden rounded-2xl bg-neutral-100">
          <Image src={form.image_url} alt="商品圖片預覽" fill className="object-contain" unoptimized />
        </div>
      ) : null}

      <button disabled={saving || uploading} className="rounded-2xl bg-neutral-900 px-5 py-3 font-semibold text-white disabled:opacity-60">
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
