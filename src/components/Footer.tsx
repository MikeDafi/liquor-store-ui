import { MapPin, Phone, Clock } from 'lucide-react';
import { storeConfig } from '../config/store';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Store Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Location */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">{storeConfig.name}</h3>
            <div className="space-y-2 text-sm text-neutral-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeConfig.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white underline underline-offset-2 transition-colors"
                >
                  {storeConfig.address}
                </a>
              </div>
              {storeConfig.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href={`tel:${storeConfig.phone}`} className="hover:text-white transition-colors">
                  {storeConfig.phone}
                </a>
              </div>
              )}
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <div>{storeConfig.hoursWeekday}</div>
                  <div>{storeConfig.hoursWeekend}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-medium mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li><a href="/category/whiskey" className="hover:text-white transition-colors">Whiskey</a></li>
              <li><a href="/category/wine" className="hover:text-white transition-colors">Wine</a></li>
              <li><a href="/category/beer" className="hover:text-white transition-colors">Beer</a></li>
              <li><a href="/category/vodka" className="hover:text-white transition-colors">Vodka</a></li>
              <li><a href="/category/tequila" className="hover:text-white transition-colors">Tequila</a></li>
            </ul>
          </div>

          {/* More */}
          <div>
            <h4 className="font-medium mb-3">More</h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li><a href="/category/food" className="hover:text-white transition-colors">Food</a></li>
              <li><a href="/category/drinks" className="hover:text-white transition-colors">Drinks</a></li>
              <li><a href="/category/tobacco" className="hover:text-white transition-colors">Tobacco</a></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-medium mb-3">Information</h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href={`mailto:${storeConfig.email}`} className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="text-center text-sm text-neutral-400 pt-6 border-t border-neutral-800">
          <p>© {new Date().getFullYear()} {storeConfig.name}. All rights reserved.</p>
          <p className="mt-2">Must be 21+ to purchase alcohol.</p>
        </div>
      </div>
    </footer>
  );
}
