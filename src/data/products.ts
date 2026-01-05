export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  size: string;
  image: string;
  description: string;
  brand: string;
  locations: string[];
  isTouristFavorite?: boolean;
}

export const categories = [
  { id: 'whiskey', name: 'Whiskey', icon: '🥃', image: 'https://images.unsplash.com/photo-1698064104861-e2dbc14ea72d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGlza2V5JTIwYm90dGxlcyUyMHNoZWxmfGVufDF8fHx8MTc2NzU2MDc3Mnww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'vodka', name: 'Vodka', icon: '🍸', image: 'https://images.unsplash.com/photo-1645784125144-4c06a561fc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2RrYSUyMGJvdHRsZXxlbnwxfHx8fDE3Njc0NjI4ODl8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'wine', name: 'Wine', icon: '🍷', image: 'https://images.unsplash.com/photo-1758827926633-621fb8694e6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwYm90dGxlcyUyMGRpc3BsYXl8ZW58MXx8fHwxNzY3NTYzODgzfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'tequila', name: 'Tequila', icon: '🥃', image: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { id: 'beer', name: 'Beer', icon: '🍺', image: 'https://images.unsplash.com/photo-1659464832543-9c6c52abcadf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFmdCUyMGJlZXIlMjBib3R0bGVzfGVufDF8fHx8MTc2NzU2MDc3M3ww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'sake', name: 'Sake', icon: '🍶', image: 'https://images.unsplash.com/photo-1579541592065-da8a15e49bc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { id: 'pharmacy', name: 'Pharmacy', icon: '💊', image: 'https://images.unsplash.com/photo-1690248387895-2db2a8072ecc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXF1b3IlMjBzdG9yZSUyMGludGVyaW9yfGVufDF8fHx8MTc2NzUzODQ2Nnww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'dairy', name: 'Dairy & Frozen', icon: '🧊', image: 'https://images.unsplash.com/photo-1690248387895-2db2a8072ecc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXF1b3IlMjBzdG9yZSUyMGludGVyaW9yfGVufDF8fHx8MTc2NzUzODQ2Nnww&ixlib=rb-4.1.0&q=80&w=1080' }
];

export const products: Product[] = [
  // Whiskey
  {
    id: 'whiskey-1',
    name: 'Yamazaki 12 Year',
    category: 'whiskey',
    subcategory: 'Japanese Whiskey',
    price: 149.99,
    size: '750ml',
    image: 'https://images.unsplash.com/photo-1698064104861-e2dbc14ea72d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGlza2V5JTIwYm90dGxlcyUyMHNoZWxmfGVufDF8fHx8MTc2NzU2MDc3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Premium Japanese single malt whiskey with notes of honey and fruit.',
    brand: 'Yamazaki',
    locations: ['union-square', 'north-beach', 'financial-district'],
    isTouristFavorite: true
  },
  {
    id: 'whiskey-2',
    name: 'Buffalo Trace Bourbon',
    category: 'whiskey',
    subcategory: 'Bourbon',
    price: 29.99,
    size: '750ml',
    image: 'https://images.unsplash.com/photo-1698064104861-e2dbc14ea72d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGlza2V5JTIwYm90dGxlcyUyMHNoZWxmfGVufDF8fHx8MTc2NzU2MDc3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Kentucky straight bourbon with rich vanilla and caramel notes.',
    brand: 'Buffalo Trace',
    locations: ['union-square', 'financial-district']
  },
  {
    id: 'whiskey-3',
    name: 'Lagavulin 16 Year',
    category: 'whiskey',
    subcategory: 'Scotch',
    price: 89.99,
    size: '750ml',
    image: 'https://images.unsplash.com/photo-1698064104861-e2dbc14ea72d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGlza2V5JTIwYm90dGxlcyUyMHNoZWxmfGVufDF8fHx8MTc2NzU2MDc3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Islay single malt Scotch with intense peat and smoke character.',
    brand: 'Lagavulin',
    locations: ['union-square', 'north-beach']
  },
  // Vodka
  {
    id: 'vodka-1',
    name: 'Grey Goose',
    category: 'vodka',
    subcategory: 'Premium Vodka',
    price: 39.99,
    size: '750ml',
    image: 'https://images.unsplash.com/photo-1645784125144-4c06a561fc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2RrYSUyMGJvdHRsZXxlbnwxfHx8fDE3Njc0NjI4ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'French premium vodka with a smooth, clean finish.',
    brand: 'Grey Goose',
    locations: ['union-square', 'north-beach', 'financial-district'],
    isTouristFavorite: true
  },
  {
    id: 'vodka-2',
    name: 'Tito\'s Handmade Vodka',
    category: 'vodka',
    subcategory: 'Craft Vodka',
    price: 24.99,
    size: '750ml',
    image: 'https://images.unsplash.com/photo-1645784125144-4c06a561fc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2RrYSUyMGJvdHRsZXxlbnwxfHx8fDE3Njc0NjI4ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'American craft vodka distilled six times for smoothness.',
    brand: 'Tito\'s',
    locations: ['union-square', 'financial-district']
  },
  // Wine
  {
    id: 'wine-1',
    name: 'Napa Valley Cabernet Sauvignon',
    category: 'wine',
    subcategory: 'Red Wine',
    price: 45.99,
    size: '750ml',
    image: 'https://images.unsplash.com/photo-1758827926633-621fb8694e6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwYm90dGxlcyUyMGRpc3BsYXl8ZW58MXx8fHwxNzY3NTYzODgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Local California red with bold tannins and dark fruit flavors.',
    brand: 'Stag\'s Leap',
    locations: ['union-square', 'north-beach', 'financial-district'],
    isTouristFavorite: true
  },
  {
    id: 'wine-2',
    name: 'Sonoma Chardonnay',
    category: 'wine',
    subcategory: 'White Wine',
    price: 28.99,
    size: '750ml',
    image: 'https://images.unsplash.com/photo-1758827926633-621fb8694e6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwYm90dGxlcyUyMGRpc3BsYXl8ZW58MXx8fHwxNzY3NTYzODgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Crisp Sonoma white wine with apple and citrus notes.',
    brand: 'Kendall-Jackson',
    locations: ['union-square', 'north-beach']
  },
  // Beer
  {
    id: 'beer-1',
    name: 'Anchor Steam Beer',
    category: 'beer',
    subcategory: 'Local Craft Beer',
    price: 12.99,
    size: '6-pack',
    image: 'https://images.unsplash.com/photo-1659464832543-9c6c52abcadf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFmdCUyMGJlZXIlMjBib3R0bGVzfGVufDF8fHx8MTc2NzU2MDc3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Classic San Francisco craft beer with a unique steam beer style.',
    brand: 'Anchor Brewing',
    locations: ['union-square', 'north-beach', 'financial-district'],
    isTouristFavorite: true
  },
  // Sake
  {
    id: 'sake-1',
    name: 'Dassai 23 Junmai Daiginjo',
    category: 'sake',
    subcategory: 'Premium Sake',
    price: 79.99,
    size: '720ml',
    image: 'https://images.unsplash.com/photo-1645784125144-4c06a561fc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2RrYSUyMGJvdHRsZXxlbnwxfHx8fDE3Njc0NjI4ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Ultra-premium Japanese sake with delicate floral notes.',
    brand: 'Dassai',
    locations: ['union-square', 'north-beach'],
    isTouristFavorite: true
  }
];

