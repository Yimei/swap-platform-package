'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getToken } from '@/lib/storage';
import { fetchUserProfile } from '@/services/api';

export function Header() {
  const [profileName, setProfileName] = useState('');

  useEffect(() => {
    async function loadProfileName() {
      const token = getToken();
      if (!token) return;

      try {
        const profile = await fetchUserProfile(token);
        setProfileName(profile.name);
      } catch {
        setProfileName('');
      }
    }

    loadProfileName();
  }, []);

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-emerald-700">
          換換看 Swap Platform
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-neutral-700">
          <Link href="/">首頁</Link>
          <Link href="/products">商品列表</Link>
          <Link href="/profile">{profileName || 'Profile'}</Link>
        </nav>
      </div>
    </header>
  );
}
