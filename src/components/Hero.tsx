import { Navigation, Search } from 'lucide-react';

interface HeroProps {
  onSearchClick: () => void;
  onDirectionsClick: () => void;
}

export function Hero({ onSearchClick, onDirectionsClick }: HeroProps) {
  return (
    <div className="relative bg-neutral-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1673671518168-f24c11781dc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW4lMjBmcmFuY2lzY28lMjB1bmlvbiUyMHNxdWFyZXxlbnwxfHx8fDE3Njc1NjM4ODR8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="San Francisco"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl mb-4">
            Full Liquor Store Near Union Square
          </h1>
          <p className="text-lg md:text-xl text-neutral-300 mb-8">
            Premium spirits, wine, sake, craft beer & essentials. Serving San Francisco since 1998.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onDirectionsClick}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Navigation className="w-5 h-5" />
              Get Directions
            </button>
            <button
              onClick={onSearchClick}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-white text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <Search className="w-5 h-5" />
              Search Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

