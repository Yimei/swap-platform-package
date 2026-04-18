'use client';

import { FormEvent, useMemo, useState } from 'react';
import { createProduct, loginUser, registerUser } from '@/services/api';
import { getToken, removeToken, saveToken } from '@/lib/storage';

const defaultProduct = {
  title: '二手兒童繪本 10 本組',
  description: '保存良好，適合 3 到 6 歲，台北市可面交。',
  category: '童書',
  point_price: 120,
  condition: '九成新',
  city: '台北市',
  image_url: '',
  image_urls: ['', '', '', '', '', ''],
};

export function AuthPanel() {
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [productForm, setProductForm] = useState(defaultProduct);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const token = useMemo(() => getToken(), []);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await registerUser(registerForm);
      setMessage('註冊成功，接著請登入。');
      setRegisterForm({ name: '', email: '', password: '' });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '註冊失敗');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const result = await loginUser(loginForm);
      saveToken(result.access_token);
      setMessage('登入成功，Token 已存到瀏覽器 localStorage。重新整理後可直接用來發商品。');
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '登入失敗');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const currentToken = getToken();
      if (!currentToken) {
        throw new Error('請先登入，瀏覽器內沒有可用 token。');
      }
      const imageUrls = productForm.image_urls.map((url) => url.trim()).filter(Boolean).slice(0, 6);
      await createProduct(currentToken, {
        ...productForm,
        image_url: imageUrls[0],
        image_urls: imageUrls,
      });
      setMessage('商品建立成功，請到商品列表頁重新整理查看。');
      setProductForm(defaultProduct);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '建立商品失敗');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={handleRegister} className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-neutral-900">註冊</h3>
        <input className="w-full rounded-2xl border border-neutral-300 px-4 py-3" placeholder="姓名" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} required />
        <input className="w-full rounded-2xl border border-neutral-300 px-4 py-3" placeholder="Email" type="email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} required />
        <input className="w-full rounded-2xl border border-neutral-300 px-4 py-3" placeholder="密碼" type="password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} required />
        <button disabled={loading} className="w-full rounded-2xl bg-neutral-900 px-4 py-3 font-semibold text-white">建立帳號</button>
      </form>

      <form onSubmit={handleLogin} className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-neutral-900">登入</h3>
        <input className="w-full rounded-2xl border border-neutral-300 px-4 py-3" placeholder="Email" type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required />
        <input className="w-full rounded-2xl border border-neutral-300 px-4 py-3" placeholder="密碼" type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
        <button disabled={loading} className="w-full rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white">登入取得 Token</button>
        <button type="button" onClick={() => { removeToken(); setMessage('已清除本機 token。'); }} className="w-full rounded-2xl border border-neutral-300 px-4 py-3 font-semibold text-neutral-800">清除 Token</button>
        <p className="text-sm text-neutral-500">目前狀態：{token ? '瀏覽器已有舊 token' : '尚未登入'}</p>
      </form>

      <form onSubmit={handleCreateProduct} className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-neutral-900">快速建立商品</h3>
        <input className="w-full rounded-2xl border border-neutral-300 px-4 py-3" placeholder="商品名稱" value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} required />
        <textarea className="min-h-28 w-full rounded-2xl border border-neutral-300 px-4 py-3" placeholder="商品描述" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required />
        <div className="grid grid-cols-2 gap-3">
          <input className="rounded-2xl border border-neutral-300 px-4 py-3" placeholder="分類" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} required />
          <input className="rounded-2xl border border-neutral-300 px-4 py-3" placeholder="城市" value={productForm.city} onChange={(e) => setProductForm({ ...productForm, city: e.target.value })} required />
          <input className="rounded-2xl border border-neutral-300 px-4 py-3" placeholder="狀況" value={productForm.condition} onChange={(e) => setProductForm({ ...productForm, condition: e.target.value })} required />
          <input className="rounded-2xl border border-neutral-300 px-4 py-3" placeholder="點數" type="number" value={productForm.point_price} onChange={(e) => setProductForm({ ...productForm, point_price: Number(e.target.value) })} required />
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-neutral-700">圖片 URL，最多 6 張</p>
          <div className="grid gap-3">
            {productForm.image_urls.map((url, index) => (
              <input
                key={index}
                className="w-full rounded-2xl border border-neutral-300 px-4 py-3"
                placeholder={`圖片 URL ${index + 1}`}
                value={url}
                onChange={(e) => {
                  const imageUrls = [...productForm.image_urls];
                  imageUrls[index] = e.target.value;
                  setProductForm({ ...productForm, image_urls: imageUrls });
                }}
              />
            ))}
          </div>
        </div>
        <button disabled={loading} className="w-full rounded-2xl bg-lime-600 px-4 py-3 font-semibold text-white">送出商品到 API</button>
      </form>

      {message ? <div className="lg:col-span-3 rounded-2xl bg-neutral-900 px-5 py-4 text-sm text-white">{message}</div> : null}
    </section>
  );
}
