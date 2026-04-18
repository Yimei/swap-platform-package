import Image from 'next/image';
import type { Product } from '@/lib/types';

export function ProductCard({ product }: { product: Product }) {
  const imageSrc = product.image_url || '/placeholder-product.svg';

  return (
    <article className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-56 w-full bg-neutral-100">
        <Image src={imageSrc} alt={product.title} fill className="object-cover" />
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-neutral-900">{product.title}</h3>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            {product.point_price} 點
          </span>
        </div>
        <p className="line-clamp-3 min-h-[72px] text-sm leading-6 text-neutral-700">{product.description}</p>
        <div className="flex flex-wrap gap-2 text-sm text-neutral-600">
          <span className="rounded-full bg-neutral-100 px-3 py-1">{product.category}</span>
          <span className="rounded-full bg-neutral-100 px-3 py-1">{product.condition}</span>
          <span className="rounded-full bg-neutral-100 px-3 py-1">{product.city}</span>
        </div>
      </div>
    </article>
  );
}
