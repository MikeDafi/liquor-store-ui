import { Hero } from '../components/Hero';
import { CategoryGrid } from '../components/CategoryGrid';
import { TouristFavorites } from '../components/TouristFavorites';
import { FAQSection } from '../components/FAQSection';
import { Truck } from 'lucide-react';
import { storeConfig } from '../config/store';

interface HomePageProps {
  onSearchClick: () => void;
  onDirectionsClick: () => void;
}

export function HomePage({ onSearchClick, onDirectionsClick }: HomePageProps) {
  return (
    <div>
      <Hero onSearchClick={onSearchClick} onDirectionsClick={onDirectionsClick} />

      
      {/* Available in Store Banner */}
      <section className="bg-green-50 border-y border-green-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg mb-1">All Products Available In-Store</h3>
              <p className="text-sm text-neutral-600">
                Browse online, shop in person. Call ahead to confirm specific items.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm bg-yellow-100 px-4 py-2 rounded-lg">
              <Truck className="w-5 h-5" />
              <span>{storeConfig.features.deliveryMessage}</span>
            </div>
          </div>
        </div>
      </section>

      <CategoryGrid />
      
      <TouristFavorites />

      <FAQSection limit={5} />
    </div>
  );
}
