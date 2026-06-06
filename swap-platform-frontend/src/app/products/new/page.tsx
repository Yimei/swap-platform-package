'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { getToken } from '@/lib/storage';
import { createProduct } from '@/services/api';

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

      <button disabled={saving} className="rounded-2xl bg-neutral-900 px-5 py-3 font-semibold text-white disabled:opacity-60">
        {saving ? '新增中...' : '新增商品'}
      </button>
    </form>
  );
}
