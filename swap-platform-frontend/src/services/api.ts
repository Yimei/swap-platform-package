import { API_BASE_URL } from '@/lib/config';
import type { LoginResponse, Product, SellerContact, UserProfile, WishlistItem } from '@/lib/types';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function fetchProducts(): Promise<Product[]> {
  return request<Product[]>('/api/v1/products');
}

export async function fetchProduct(productId: number): Promise<Product> {
  return request<Product>(`/api/v1/products/${productId}`);
}

export async function fetchSellerContact(token: string, productId: number): Promise<SellerContact> {
  return request<SellerContact>(`/api/v1/products/${productId}/seller-contact`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function registerUser(payload: { name: string; email: string; password: string }) {
  return request<{ id: number; email: string; name: string }>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: { email: string; password: string }): Promise<LoginResponse> {
  return request<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchUserProfile(token: string): Promise<UserProfile> {
  return request<UserProfile>('/api/v1/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createProduct(
  token: string,
  payload: {
    title: string;
    description: string;
    category: string;
    point_price: number;
    condition: string;
    city: string;
    image_url?: string;
  },
): Promise<Product> {
  return request<Product>('/api/v1/products', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function uploadProductImage(token: string, image: File): Promise<{ image_url: string }> {
  const formData = new FormData();
  formData.append('image', image);

  const response = await fetch(`${API_BASE_URL}/api/v1/uploads/product-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Image upload failed');
  }

  return response.json() as Promise<{ image_url: string }>;
}

export async function updateProduct(
  token: string,
  productId: number,
  payload: {
    title: string;
    description: string;
    category: string;
    point_price: number;
    condition: string;
    city: string;
    image_url?: string;
  },
): Promise<Product> {
  return request<Product>(`/api/v1/products/${productId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(token: string, productId: number): Promise<void> {
  return request<void>(`/api/v1/products/${productId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchWishlistItems(token: string): Promise<WishlistItem[]> {
  return request<WishlistItem[]>('/api/v1/wishlist', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createWishlistItem(
  token: string,
  payload: { item_name: string; desired_point_price: number },
): Promise<WishlistItem> {
  return request<WishlistItem>('/api/v1/wishlist', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteWishlistItem(token: string, itemId: number): Promise<void> {
  return request<void>(`/api/v1/wishlist/${itemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
