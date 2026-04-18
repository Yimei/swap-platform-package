'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ProductList } from '@/components/ProductList';
import type { UserProfile } from '@/lib/types';
import { getToken } from '@/lib/storage';
import { fetchUserProfile } from '@/services/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const token = getToken();
      if (!token) {
        setError('Please log in to view your profile.');
        setLoading(false);
        return;
      }

      try {
        const data = await fetchUserProfile(token);
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load profile.');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4">Loading profile...</div>;
  }

  if (error || !profile) {
    return (
      <section className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">
        <p>{error || 'Profile not found.'}</p>
        <Link href="/" className="inline-flex rounded-2xl bg-rose-900 px-4 py-2 text-sm font-semibold text-white">
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
          <Link href="/" className="rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">
            Add product
          </Link>
        </div>

        <ProductList products={profile.products} />
      </section>
    </div>
  );
}
