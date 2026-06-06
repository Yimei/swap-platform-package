'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { getToken, saveToken } from '@/lib/storage';
import { loginUser } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace('/profile');
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await loginUser(form);
      saveToken(result.access_token);
      router.push('/profile');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '登入失敗，請稍後再試。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md py-12">
      <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-emerald-700">歡迎回來</p>
          <h1 className="mt-2 text-3xl font-bold text-neutral-900">登入</h1>
        </div>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-neutral-700">Email</span>
          <input className="w-full rounded-2xl border border-neutral-300 px-4 py-3" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-neutral-700">密碼</span>
          <input className="w-full rounded-2xl border border-neutral-300 px-4 py-3" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </label>
        {message ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{message}</p> : null}
        <button disabled={loading} className="w-full rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white disabled:opacity-60">
          {loading ? '登入中...' : '登入'}
        </button>
        <p className="text-center text-sm text-neutral-600">
          沒有帳號？ <Link href="/register" className="font-semibold text-emerald-700">立即註冊</Link>
        </p>
      </form>
    </div>
  );
}
