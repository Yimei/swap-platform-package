import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/lib/types';

export function ProductList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-600">
        目前沒有商品，先到後端建立商品後再刷新看看。
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
