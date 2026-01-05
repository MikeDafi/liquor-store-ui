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
      {/* Reviews Section - Moved to Top */}
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
                "Perfect location near Union Square. Great selection of Japanese whiskey and local wines. Staff is super helpful!"
              </p>
              <div className="text-sm text-neutral-600">- Sarah M., Tourist from NYC</div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mb-4 text-neutral-700">
                "Been shopping here for years. Best liquor store in SF. They carry everything and prices are fair."
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
                "Open late which is amazing! Got some Anchor Steam Beer and snacks for our hotel. Very convenient."
              </p>
              <div className="text-sm text-neutral-600">- Emma K., Visiting from LA</div>
            </div>
          </div>
        </div>
      </section>

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

