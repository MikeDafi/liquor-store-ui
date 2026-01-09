import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { getCurrentStore, getOtherStores } from '../data/storeConfig';

export function Footer() {
  const currentStore = getCurrentStore();
  const otherStores = getOtherStores();

  return (
    <footer className="bg-neutral-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Current Store Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-3">
            <h3 className="text-lg">{currentStore.name}</h3>
            <p className="text-sm text-neutral-400">{currentStore.tagline}</p>
            <div className="space-y-2 text-sm text-neutral-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{currentStore.address.full}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href={`tel:${currentStore.phone}`} className="hover:text-white transition-colors">
                  {currentStore.phone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <div>Mon-Fri: {currentStore.hours.weekday}</div>
                  <div>Sat-Sun: {currentStore.hours.weekend}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Other Locations */}
          {otherStores.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg">Other Locations</h3>
              <div className="space-y-4">
                {otherStores.map(store => (
                  <a
                    key={store.id}
                    href={store.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{store.icon}</span>
                          <span className="font-medium">{store.name}</span>
                        </div>
                        <div className="text-sm text-neutral-400 mt-1">{store.address.full}</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-neutral-400" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-neutral-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div>
              <h4 className="mb-3">Shop</h4>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li><a href="/category/whiskey" className="hover:text-white transition-colors">Whiskey</a></li>
                <li><a href="/category/vodka" className="hover:text-white transition-colors">Vodka</a></li>
                <li><a href="/category/wine" className="hover:text-white transition-colors">Wine</a></li>
                <li><a href="/category/beer" className="hover:text-white transition-colors">Beer</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3">Categories</h4>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li><a href="/category/tequila" className="hover:text-white transition-colors">Tequila</a></li>
                <li><a href="/category/sake" className="hover:text-white transition-colors">Sake</a></li>
                <li><a href="/category/pharmacy" className="hover:text-white transition-colors">Pharmacy</a></li>
                <li><a href="/category/dairy" className="hover:text-white transition-colors">Dairy & Frozen</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3">Information</h4>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="/search" className="hover:text-white transition-colors">Search Products</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3">Coming Soon</h4>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li>🚚 Delivery Service</li>
                <li>📱 Mobile App</li>
                <li>🎁 Gift Cards</li>
              </ul>
            </div>
          </div>

          <div className="text-center text-sm text-neutral-400 pt-6 border-t border-neutral-800">
            <p>© 2026 {currentStore.name}. All rights reserved. Must be 21+ to purchase alcohol.</p>
            <p className="mt-2">Licensed & Insured</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
