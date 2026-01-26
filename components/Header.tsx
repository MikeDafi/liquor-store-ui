import { useState } from 'react';
import { Search, Menu, X, ChevronDown, ExternalLink } from 'lucide-react';
import { getCurrentStore, getOtherStores } from '../data/storeConfig';

interface HeaderProps {
  selectedLocation: string;
  onLocationChange: (locationId: string) => void;
  onSearch: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  const currentStore = getCurrentStore();
  const otherStores = getOtherStores();

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
              <span className="text-2xl">🥃</span>
              <div>
                <div className="text-neutral-900">{currentStore.name}</div>
                <div className="text-xs text-neutral-600 hidden sm:block">Since {currentStore.since}</div>
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <a href="/" className="hover:text-neutral-600 transition-colors">Home</a>
            
            {/* Other Locations Dropdown */}
            {otherStores.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                  className="flex items-center gap-1 hover:text-neutral-600 transition-colors"
                >
                  Other Locations
                  <ChevronDown className={`w-4 h-4 transition-transform ${locationDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {locationDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setLocationDropdownOpen(false)}
                    />
                    {/* Dropdown */}
                    <div className="absolute left-0 mt-2 w-72 bg-white border border-neutral-200 rounded-lg shadow-lg z-20">
                      {otherStores.map(store => (
                        <a
                          key={store.id}
                          href={store.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setLocationDropdownOpen(false)}
                          className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0 first:rounded-t-lg last:rounded-b-lg"
                        >
                          <div>
                            <div className="font-medium">{store.name}</div>
                            <div className="text-sm text-neutral-600">Visit store website</div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-neutral-400" />
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            
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
            
            {/* Other Locations - Mobile */}
            {otherStores.length > 0 && (
              <>
                <div className="pt-2 pb-1 px-4 text-sm text-neutral-600 font-medium">
                  Other Locations
                </div>
                {otherStores.map(store => (
                  <a
                    key={store.id}
                    href={store.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-4 hover:bg-neutral-50 rounded-lg transition-colors border-l-2 border-neutral-200 ml-4"
                  >
                    <div>
                      <div className="font-medium">{store.name}</div>
                      <div className="text-sm text-neutral-500">Visit store</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-neutral-400" />
                  </a>
                ))}
              </>
            )}
            
            <a
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              FAQ
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
