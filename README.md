# SF Liquor & Market

A modern React + Vite + TypeScript web application for a San Francisco liquor store with multiple locations.

## Features

- Browse products by category (Whiskey, Vodka, Wine, Beer, Sake, etc.)
- Multiple store locations with hours and contact info
- Product search functionality
- Mobile-responsive design with bottom navigation bar
- FAQ section

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── ui/         # Base UI components
│   └── figma/      # Figma-related components
├── pages/          # Page components
├── data/           # Static data (products, locations, FAQs)
├── styles/         # Global CSS
├── App.tsx         # Main app component with routing
└── main.tsx        # Entry point
```

## Deployment

This project is configured for Vercel deployment with client-side routing support via `vercel.json`.

## License

MIT

