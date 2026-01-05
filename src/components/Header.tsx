import { useState } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { locations } from '../data/locations';
import { storeConfig } from '../config/store';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{storeConfig.icon}</span>
              <div>
                <div className="text-neutral-900">{storeConfig.name}</div>
                <div className="text-xs text-neutral-600 hidden sm:block">{storeConfig.tagline}</div>
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <a href="/" className="hover:text-neutral-600 transition-colors">Home</a>
            <div className="relative">
              <button
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center gap-1 hover:text-neutral-600 transition-colors"
              >
                Other Locations
                <ChevronDown className="w-4 h-4" />
              </button>

              {locationDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white border border-neutral-200 rounded-lg shadow-lg">
                  {locations.map(location => (
                    <a
                      key={location.id}
                      href={`/location/${location.id}`}
                      onClick={() => setLocationDropdownOpen(false)}
                      className="block px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0"
                    >
                      <div className="font-medium">{location.name}</div>
                      <div className="text-sm text-neutral-600">{location.address}</div>
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a href="/faq" className="hover:text-neutral-600 transition-colors">FAQ</a>
          </nav>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search whiskey, wine, vodka..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white">
          <nav className="px-4 py-4 space-y-1">
            <a
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              Home
            </a>
            <a
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              FAQ
            </a>
            
            <div className="pt-2 pb-1 px-4 text-sm text-neutral-600">Other Locations</div>
            {locations.map(location => (
              <a
                key={location.id}
                href={`/location/${location.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 hover:bg-neutral-50 rounded-lg transition-colors border-l-2 border-neutral-200 ml-4"
              >
                <div className="font-medium">{location.name}</div>
                <div className="text-sm text-neutral-600">{location.address}</div>
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
