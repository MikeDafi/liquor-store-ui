import { Phone, Navigation, Search, Home } from 'lucide-react';
import { locations } from '../data/locations';

interface MobileBottomBarProps {
  selectedLocation: string;
  onSearchClick: () => void;
}

export function MobileBottomBar({ selectedLocation, onSearchClick }: MobileBottomBarProps) {
  const currentLocation = locations.find(loc => loc.id === selectedLocation);

  const handleCall = () => {
    if (currentLocation) {
      window.location.href = `tel:${currentLocation.phone}`;
    }
  };

  const handleDirections = () => {
    if (currentLocation) {
      const address = encodeURIComponent(currentLocation.address);
      window.open(`https://maps.google.com/?q=${address}`, '_blank');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 lg:hidden z-50">
      <div className="grid grid-cols-4 gap-1 p-2">
        <a
          href="/"
          className="flex flex-col items-center justify-center py-2 px-3 hover:bg-neutral-50 rounded-lg transition-colors"
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="text-xs">Home</span>
        </a>
        
        <button
          onClick={onSearchClick}
          className="flex flex-col items-center justify-center py-2 px-3 hover:bg-neutral-50 rounded-lg transition-colors"
        >
          <Search className="w-5 h-5 mb-1" />
          <span className="text-xs">Search</span>
        </button>

        <button
          onClick={handleCall}
          className="flex flex-col items-center justify-center py-2 px-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <Phone className="w-5 h-5 mb-1" />
          <span className="text-xs">Call</span>
        </button>

        <button
          onClick={handleDirections}
          className="flex flex-col items-center justify-center py-2 px-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <Navigation className="w-5 h-5 mb-1" />
          <span className="text-xs">Directions</span>
        </button>
      </div>
    </div>
  );
}
