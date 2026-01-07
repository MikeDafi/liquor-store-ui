import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { locations } from '../data/locations';
import { categories } from '../data/products';
import { FAQSection } from '../components/FAQSection';

interface LocationPageProps {
  locationId: string;
}

export function LocationPage({ locationId }: LocationPageProps) {
  const location = locations.find(loc => loc.id === locationId);

  if (!location) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1>Location not found</h1>
      </div>
    );
  }

  const handleCall = () => {
    window.location.href = `tel:${location.phone}`;
  };

  const handleDirections = () => {
    const address = encodeURIComponent(location.address);
    window.open(`https://maps.google.com/?q=${address}`, '_blank');
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-neutral-900 text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl mb-4">{location.name}</h1>
          <p className="text-lg text-neutral-300 max-w-2xl">
            {location.description}
          </p>
        </div>
      </div>

      {/* Location Details */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Info Card */}
          <div>
            <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl mb-6">Store Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">Address</div>
                    <div>{location.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">Phone</div>
                    <a href={`tel:${location.phone}`} className="hover:underline">
                      {location.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">Hours</div>
                    <div>{location.hours.weekday}</div>
                    <div>{location.hours.weekend}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCall}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call Store
                </button>
                <button
                  onClick={handleDirections}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </button>
              </div>
            </div>

            {/* Store Image */}
            <div className="rounded-lg overflow-hidden">
              <img
                src={location.image}
                alt={location.name}
                className="w-full h-64 object-cover"
              />
            </div>
          </div>

          {/* Map */}
          <div className="h-96 lg:h-full min-h-96 bg-neutral-100 rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(location.address)}`}
              allowFullScreen
              title={`Map of ${location.name}`}
              className="w-full h-full"
            />
            <div className="flex items-center justify-center h-full text-neutral-600">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <div>{location.address}</div>
                <button
                  onClick={handleDirections}
                  className="mt-4 px-4 py-2 border border-neutral-900 rounded-lg hover:bg-neutral-900 hover:text-white transition-colors"
                >
                  Open in Google Maps
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Categories */}
      <section className="bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl mb-8">What's Available at This Location</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => (
              <a
                key={category.id}
                href={`/category/${category.id}`}
                className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div>{category.name}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Location-specific FAQ */}
      <div className="bg-white">
        <FAQSection />
      </div>
    </div>
  );
}
