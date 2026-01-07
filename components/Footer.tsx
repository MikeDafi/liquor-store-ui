import { MapPin, Phone, Clock } from 'lucide-react';
import { locations } from '../data/locations';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {locations.map(location => (
            <div key={location.id} className="space-y-3">
              <h3 className="text-lg">{location.name}</h3>
              <div className="space-y-2 text-sm text-neutral-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{location.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <a href={`tel:${location.phone}`} className="hover:text-white transition-colors">
                    {location.phone}
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div>{location.hours.weekday}</div>
                    <div>{location.hours.weekend}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
              <h4 className="mb-3">Locations</h4>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li><a href="/location/union-square" className="hover:text-white transition-colors">Union Square</a></li>
                <li><a href="/location/north-beach" className="hover:text-white transition-colors">North Beach</a></li>
                <li><a href="/location/financial-district" className="hover:text-white transition-colors">Financial District</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3">Information</h4>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
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
            <p>© 2026 SF Liquor & Market. All rights reserved. Must be 21+ to purchase alcohol.</p>
            <p className="mt-2">Serving San Francisco since 1998 • Licensed & Insured</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
