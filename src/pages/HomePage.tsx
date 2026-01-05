import { Hero } from '../components/Hero';
import { CategoryGrid } from '../components/CategoryGrid';
import { TouristFavorites } from '../components/TouristFavorites';
import { FAQSection } from '../components/FAQSection';
import { Star, Truck } from 'lucide-react';
import { storeConfig } from '../config/store';

interface HomePageProps {
  onSearchClick: () => void;
  onDirectionsClick: () => void;
}

export function HomePage({ onSearchClick, onDirectionsClick }: HomePageProps) {
  return (
    <div>
      <Hero onSearchClick={onSearchClick} onDirectionsClick={onDirectionsClick} />

      {/* Reviews Section - Below Hero */}
      <section className="bg-neutral-50 py-12 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl mb-8">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mb-4 text-neutral-700">
                "Great selection and friendly staff. Love this neighborhood spot!"
              </p>
              <div className="text-sm text-neutral-600">- Sarah M., Local Customer</div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mb-4 text-neutral-700">
                "Been shopping here for years. They carry everything and prices are fair."
              </p>
              <div className="text-sm text-neutral-600">- David L., Local Resident</div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mb-4 text-neutral-700">
                "Convenient location and great hours. Perfect for last-minute needs."
              </p>
              <div className="text-sm text-neutral-600">- Emma K., Regular Customer</div>
            </div>
          </div>
        </div>
      </section>
      
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
