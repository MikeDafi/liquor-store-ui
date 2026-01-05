# SF Liquor & Market

A modern React + Vite + TypeScript web application for a San Francisco liquor store with multiple locations.

## Features

- Browse products by category (Whiskey, Vodka, Wine, Beer, Sake, etc.)
- Multiple store locations with hours and contact info
- Product search functionality
- Mobile-responsive design with bottom navigation bar
- FAQ section
- **Google Sheets Integration** - Product data pulled from spreadsheet
- **Per-Store Configuration** - Customize for different stores via Vercel env vars

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Google Sheets** - Data source (no API key needed for public sheets)

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

## Configuration

### Vercel Environment Variables

Store configurations are managed via **Vercel Environment Variables**. This is secure because:
- Configs are not committed to git
- Each deployment can have different values
- Vercel encrypts values at rest

#### Setting Up in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_STORE_NAME` | Store display name | `SF Liquor & Market` |
| `VITE_STORE_TAGLINE` | Tagline under logo | `Since 1998` |
| `VITE_STORE_DESCRIPTION` | Hero description | `Premium spirits, wine...` |
| `VITE_STORE_SINCE` | Year established | `1998` |
| `VITE_STORE_ICON` | Emoji icon | `🥃` |
| `VITE_STORE_EMAIL` | Contact email | `info@store.com` |
| `VITE_STORE_PHONE` | Contact phone | `(415) 555-0100` |
| `VITE_GOOGLE_SHEET_ID` | Google Sheets ID | `1yjEkHPrT...` |
| `VITE_PRODUCTS_SHEET_GID` | Products sheet GID | `2011133176` |
| `VITE_LOCATIONS_SHEET_GID` | Locations sheet GID | `0` |
| `VITE_DELIVERY_ENABLED` | Enable delivery | `false` |
| `VITE_DELIVERY_MESSAGE` | Delivery banner text | `Coming soon!` |

See `env.example` for the full list of available variables.

### Google Sheets Data Source

Products, locations, categories, and FAQs can be loaded from a Google Sheet.

#### Setting Up the Spreadsheet

1. Create a Google Sheet with these tabs:
   - **Products** - id, name, category, subcategory, price, size, image, description, brand, locations, isTouristFavorite
   - **Locations** - id, name, address, phone, hoursWeekday, hoursWeekend, lat, lng, image, description
   - **Categories** - id, name, icon, image
   - **FAQs** - id, question, answer, category

2. **Publish the sheet:**
   - File → Share → Publish to web
   - Select "Entire Document" and "CSV"
   - Click Publish

3. **Get the Sheet ID and GIDs:**
   - Sheet ID is in the URL: `docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
   - GID is after `gid=` in the URL when viewing each tab

4. **Add to Vercel:**
   - `VITE_GOOGLE_SHEET_ID` = your sheet ID
   - `VITE_PRODUCTS_SHEET_GID` = GID of products tab
   - etc.

### Local Development

For local development, create a `.env.local` file:

```bash
cp env.example .env.local
# Edit .env.local with your values
```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── ui/         # Base UI components
│   └── figma/      # Figma-related components
├── config/         # Store configuration
│   └── store.ts    # Main config (reads from env vars)
├── hooks/          # React hooks
│   └── useSheetData.ts  # Google Sheets data fetching
├── lib/            # Utilities
│   └── sheets.ts   # Google Sheets API utilities
├── pages/          # Page components
├── data/           # Fallback static data
├── styles/         # Global CSS
├── App.tsx         # Main app component with routing
└── main.tsx        # Entry point
```

## Deploying Multiple Stores

To deploy for a different store:

1. Fork this repository
2. Create a new Vercel project from the fork
3. Set the store-specific environment variables
4. Create a Google Sheet with that store's data
5. Deploy!

Each store gets its own:
- Custom branding (name, icon, colors)
- Product catalog (via Google Sheets)
- Location information
- Contact details

## License

MIT
