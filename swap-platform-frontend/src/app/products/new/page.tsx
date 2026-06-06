'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ClipboardEvent, FormEvent, useEffect, useState } from 'react';
import { getToken } from '@/lib/storage';
import { createProduct, uploadProductImage } from '@/services/api';

const emptyForm = {
  title: '',
  description: '',
  category: '',
  point_price: 0,
  condition: '',
  city: '',
  image_url: '',
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setIsAuthenticated(Boolean(getToken()));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const token = getToken();
    if (!token) {
      setIsAuthenticated(false);
      setError('請先登入才能新增商品。');
      return;
    }

    setSaving(true);
    try {
      await createProduct(token, {
        ...form,
        image_url: form.image_url || undefined,
      });
      router.push('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : '無法新增商品。');
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
    try {
      const result = await uploadProductImage(token, image);
      setForm((currentForm) => ({ ...currentForm, image_url: result.image_url }));
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

  if (isAuthenticated === null) {
    return <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4">載入中...</div>;
  }

  if (!isAuthenticated) {
    return (
      <section className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">
        <p>請先登入才能新增商品。</p>
        <Link href="/login" className="inline-flex rounded-2xl bg-rose-900 px-4 py-2 text-sm font-semibold text-white">
          前往登入
        </Link>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-5 rounded-2xl border border-neutral-200 bg-white p-6">
      <div>
        <Link href="/profile" className="text-sm font-semibold text-emerald-700">
          返回 Profile
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-neutral-900">新增商品</h1>
        <p className="mt-2 text-neutral-600">填寫商品資訊與希望交換的點數。</p>
      </div>

      {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <input className="w-full rounded-2xl border border-neutral-300 px-4 py-3" placeholder="商品名稱" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
      <textarea className="min-h-32 w-full rounded-2xl border border-neutral-300 px-4 py-3" placeholder="商品描述" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />

      <div className="grid gap-4 md:grid-cols-2">
        <input className="rounded-2xl border border-neutral-300 px-4 py-3" placeholder="分類" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required />
        <input className="rounded-2xl border border-neutral-300 px-4 py-3" placeholder="城市" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} required />
        <input className="rounded-2xl border border-neutral-300 px-4 py-3" placeholder="商品狀況" value={form.condition} onChange={(event) => setForm({ ...form, condition: event.target.value })} required />
        <input className="rounded-2xl border border-neutral-300 px-4 py-3" placeholder="點數" type="number" min="0" value={form.point_price} onChange={(event) => setForm({ ...form, point_price: Number(event.target.value) })} required />
      </div>

      <input className="w-full rounded-2xl border border-neutral-300 px-4 py-3" placeholder="圖片 URL（可不填）" value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} />

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
        {saving ? '新增中...' : '新增商品'}
      </button>
    </form>
  );
}
