'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AUTH_CHANGED_EVENT, getToken, removeToken } from '@/lib/storage';
import { fetchUserProfile } from '@/services/api';

export function Header() {
  const router = useRouter();
  const [profileName, setProfileName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function loadProfileName() {
      const token = getToken();
      if (!token) {
        setProfileName('');
        setIsAuthenticated(false);
        return;
      }

      try {
        const profile = await fetchUserProfile(token);
        setProfileName(profile.name);
        setIsAuthenticated(true);
      } catch {
        setProfileName('');
        setIsAuthenticated(false);
      }
    }

    loadProfileName();

    window.addEventListener(AUTH_CHANGED_EVENT, loadProfileName);
    window.addEventListener('storage', loadProfileName);

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, loadProfileName);
      window.removeEventListener('storage', loadProfileName);
    };
  }, []);

  function handleLogout() {
    removeToken();
    router.push('/');
  }

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-emerald-700">
          換換看 Swap Platform
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-neutral-700">
          <Link href="/">首頁</Link>
          <Link href="/products">商品列表</Link>
          <Link href="/wishlist">願望清單</Link>
          {isAuthenticated ? (
            <>
              <Link href="/profile">{profileName || 'Profile'}</Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-neutral-300 px-4 py-2 font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                登出
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
            >
              登入
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
