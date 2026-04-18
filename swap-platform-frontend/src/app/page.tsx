import { AuthPanel } from '@/components/AuthPanel';
import { FeatureGrid } from '@/components/FeatureGrid';
import { Hero } from '@/components/Hero';
import { ProductList } from '@/components/ProductList';
import { API_BASE_URL } from '@/lib/config';
import type { Product } from '@/lib/types';

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/products`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    return (await res.json()) as Product[];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="space-y-10">
      <Hero />
      <FeatureGrid />

      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">API demo</h2>
          <p className="mt-2 text-neutral-700">
            Register, log in, create products, and browse products from the FastAPI backend.
          </p>
        </div>
        <AuthPanel />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Products</h2>
          <p className="mt-2 text-neutral-700">Latest active product listings.</p>
        </div>
        <ProductList products={products} />
      </section>
    </div>
  );
}
