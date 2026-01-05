import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomBar } from './components/MobileBottomBar';
import { HomePage } from './pages/HomePage';
import { LocationPage } from './pages/LocationPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductPage } from './pages/ProductPage';
import { FAQPage } from './pages/FAQPage';
import { SearchPage } from './pages/SearchPage';
import { locations } from './data/locations';

type Page = 
  | { type: 'home' }
  | { type: 'location'; locationId: string }
  | { type: 'category'; categoryId: string }
  | { type: 'product'; productId: string }
  | { type: 'faq' }
  | { type: 'search'; query?: string };

function App() {
  const [selectedLocation] = useState(locations[0].id);
  const [currentPage, setCurrentPage] = useState<Page>({ type: 'home' });

  // Simple client-side routing
  useEffect(() => {
    const handleNavigation = () => {
      const path = window.location.pathname;

      if (path === '/' || path === '') {
        setCurrentPage({ type: 'home' });
      } else if (path.startsWith('/location/')) {
        const locationId = path.replace('/location/', '');
        setCurrentPage({ type: 'location', locationId });
      } else if (path.startsWith('/category/')) {
        const categoryId = path.replace('/category/', '');
        setCurrentPage({ type: 'category', categoryId });
      } else if (path.startsWith('/product/')) {
        const productId = path.replace('/product/', '');
        setCurrentPage({ type: 'product', productId });
      } else if (path === '/faq') {
        setCurrentPage({ type: 'faq' });
      } else if (path === '/search') {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q') || '';
        setCurrentPage({ type: 'search', query });
      }
    };

    handleNavigation();
    
    // Handle clicks on internal links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const url = new URL(link.href);
        window.history.pushState({}, '', url.pathname + url.search + url.hash);
        handleNavigation();
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('popstate', handleNavigation);
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`);
      setCurrentPage({ type: 'search', query });
      window.scrollTo(0, 0);
    }
  };

  const handleSearchClick = () => {
    window.history.pushState({}, '', '/search');
    setCurrentPage({ type: 'search' });
    window.scrollTo(0, 0);
  };

  const handleDirectionsClick = () => {
    const location = locations.find(loc => loc.id === selectedLocation);
    if (location) {
      const address = encodeURIComponent(location.address);
      window.open(`https://maps.google.com/?q=${address}`, '_blank');
    }
  };

  const renderPage = () => {
    switch (currentPage.type) {
      case 'home':
        return (
          <HomePage
            onSearchClick={handleSearchClick}
            onDirectionsClick={handleDirectionsClick}
          />
        );
      case 'location':
        return <LocationPage locationId={currentPage.locationId} />;
      case 'category':
        return <CategoryPage categoryId={currentPage.categoryId} />;
      case 'product':
        return <ProductPage productId={currentPage.productId} />;
      case 'faq':
        return <FAQPage />;
      case 'search':
        return <SearchPage initialQuery={currentPage.query} />;
      default:
        return <HomePage onSearchClick={handleSearchClick} onDirectionsClick={handleDirectionsClick} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        onSearch={handleSearch}
      />
      
      <main className="flex-1 pb-20 lg:pb-0">
        {renderPage()}
      </main>

      <Footer />

      <MobileBottomBar
        selectedLocation={selectedLocation}
        onSearchClick={handleSearchClick}
      />
    </div>
  );
}

export default App;

