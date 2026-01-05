export interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: {
    weekday: string;
    weekend: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  image: string;
  description: string;
}

export const locations: Location[] = [
  {
    id: 'union-square',
    name: 'Union Square Liquor & Market',
    address: '123 Powell Street, San Francisco, CA 94102',
    phone: '(415) 555-0100',
    hours: {
      weekday: 'Mon-Fri: 8:00 AM - 11:00 PM',
      weekend: 'Sat-Sun: 9:00 AM - 12:00 AM'
    },
    coordinates: {
      lat: 37.7879,
      lng: -122.4074
    },
    image: 'https://images.unsplash.com/photo-1673671518168-f24c11781dc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW4lMjBmcmFuY2lzY28lMjB1bmlvbiUyMHNxdWFyZXxlbnwxfHx8fDE3Njc1NjM4ODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Our flagship location in the heart of Union Square, serving tourists and locals with a premium selection.'
  },
  {
    id: 'north-beach',
    name: 'North Beach Liquor & Provisions',
    address: '456 Columbus Avenue, San Francisco, CA 94133',
    phone: '(415) 555-0200',
    hours: {
      weekday: 'Mon-Fri: 9:00 AM - 10:00 PM',
      weekend: 'Sat-Sun: 10:00 AM - 11:00 PM'
    },
    coordinates: {
      lat: 37.8024,
      lng: -122.4102
    },
    image: 'https://images.unsplash.com/photo-1690248387895-2db2a8072ecc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXF1b3IlMjBzdG9yZSUyMGludGVyaW9yfGVufDF8fHx8MTc2NzUzODQ2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Located in vibrant North Beach, featuring Italian wines and local craft selections.'
  },
  {
    id: 'financial-district',
    name: 'Financial District Liquor Express',
    address: '789 Market Street, San Francisco, CA 94103',
    phone: '(415) 555-0300',
    hours: {
      weekday: 'Mon-Fri: 7:00 AM - 10:00 PM',
      weekend: 'Sat-Sun: 9:00 AM - 10:00 PM'
    },
    coordinates: {
      lat: 37.7897,
      lng: -122.4012
    },
    image: 'https://images.unsplash.com/photo-1690248387895-2db2a8072ecc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXF1b3IlMjBzdG9yZSUyMGludGVyaW9yfGVufDF8fHx8MTc2NzUzODQ2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Convenient downtown location perfect for after-work shoppers and business travelers.'
  }
];

