import { getCurrentUserId } from '@/lib/storage';

const FAVORITE_PRODUCT_IDS_KEY = 'swap_platform_favorite_product_ids';

export const FAVORITES_CHANGED_EVENT = 'swap-platform-favorites-changed';
export const MAX_FAVORITE_PRODUCTS = 30;

function getStorageKey(): string | null {
  const userId = getCurrentUserId();
  return userId ? `${FAVORITE_PRODUCT_IDS_KEY}:${userId}` : null;
}

export function getFavoriteProductIds(): number[] {
  if (typeof window === 'undefined') return [];
  const storageKey = getStorageKey();
  if (!storageKey) return [];

  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(value) ? value.filter((id): id is number => Number.isInteger(id) && id > 0) : [];
  } catch {
    return [];
  }
}

export function isFavoriteProduct(productId: number): boolean {
  return getFavoriteProductIds().includes(productId);
}

export function toggleFavoriteProduct(productId: number): boolean {
  const storageKey = getStorageKey();
  if (!storageKey) return false;

  const favoriteIds = getFavoriteProductIds();
  const isFavorite = favoriteIds.includes(productId);
  if (!isFavorite && favoriteIds.length >= MAX_FAVORITE_PRODUCTS) {
    throw new Error(`收藏商品最多 ${MAX_FAVORITE_PRODUCTS} 件。`);
  }
  const nextIds = isFavorite ? favoriteIds.filter((id) => id !== productId) : [...favoriteIds, productId];

  localStorage.setItem(storageKey, JSON.stringify(nextIds));
  window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
  return !isFavorite;
}
