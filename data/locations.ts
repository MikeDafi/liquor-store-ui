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

// TODO: Replace with actual store information
export const locations: Location[] = [
  {
    id: 'main-store',
    name: 'Store Name',
    address: 'Address',
    phone: '',
    hours: {
      weekday: '',
      weekend: ''
    },
    coordinates: {
      lat: 0,
      lng: 0
    },
    image: '',
    description: ''
  }
];
