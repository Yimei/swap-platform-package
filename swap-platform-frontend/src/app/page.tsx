import { FeatureGrid } from '@/components/FeatureGrid';
import { Hero } from '@/components/Hero';
import { HomeProductSearch } from '@/components/HomeProductSearch';

export default function HomePage() {
  return (
    <div className="space-y-10">
      <Hero />
      <HomeProductSearch />
      <FeatureGrid />
    </div>
  );
}
