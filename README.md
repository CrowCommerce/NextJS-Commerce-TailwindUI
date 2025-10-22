# Next.js Commerce × Tailwind UI

A high-performance, server-rendered Next.js ecommerce application built on Vercel's Next.js Commerce template, enhanced with premium Tailwind UI components for a polished, production-ready shopping experience.

## Built With

- **Next.js 16** (canary) - App Router with React Server Components
- **React 19** - Latest features including Server Actions, Suspense, and useOptimistic
- **Tailwind UI** - Premium UI components from Tailwind Labs
- **Shopify** - Headless commerce platform via Storefront API
- **TypeScript** - Full type safety
- **Headless UI** - Accessible, unstyled UI components

## Based On

This project is built on top of [Vercel's Next.js Commerce](https://github.com/vercel/commerce) starter template and enhanced with Tailwind UI components for a more polished user experience.

## Major Customizations

### 🎨 UI Framework Overhaul

Replaced the minimalist Vercel Commerce UI with premium Tailwind UI components throughout:

- **Navigation**: Enhanced navbar with desktop/mobile split views, breadcrumbs
- **Product Grid**: Tailwind UI catalog layouts with hover effects
- **Product Detail**: Rich product pages with image galleries and variant selection
- **Cart**: Sliding drawer using Headless UI Dialog components
- **Forms**: Styled form inputs and buttons with focus states
- **Search**: Command palette (⌘K) for instant product search

### 🏠 Enhanced Home Page

Custom home page sections:
- **Hero Section**: Full-width hero with call-to-action
- **Trending Products**: Showcase of newest/featured products
- **Collections**: Featured category highlights

### 🔍 Advanced Search

- **Command Palette**: Keyboard-accessible search (Cmd/Ctrl + K)
- **Instant Results**: Real-time product search with debouncing
- **Accessible**: Full keyboard navigation support

### 🛍️ Improved Shopping Experience

**Product Pages**:
- Related products section
- Enhanced product detail view with Tailwind UI components
- Optimized image galleries
- Static generation with `generateStaticParams` for instant loading

**Category Pages**:
- New `/products` and `/products/[collection]` routes
- Advanced filtering and sorting
- Mobile-optimized filter drawer

**Cart System**:
- Sliding drawer interface
- Optimistic UI updates
- Fixed cart state management with `revalidatePath`
- Auto-open on add to cart

### 💰 Context-Aware Price Display

Multiple price components for different contexts:
- `ProductGridPrice` - Grid/catalog views
- `ProductDetailPrice` - Product detail pages
- `CartPrice` - Shopping cart

### 🏗️ Architecture Improvements

**Route Organization**:
- Added `(store)` route group for logical separation
- Organized product and search routes

**Data Layer**:
- Transformation utilities (`transformShopifyProductToTailwind`, etc.)
- Convert Shopify data to Tailwind UI component formats
- Type-safe data transformations

**Performance**:
- Static generation with `'use cache'` directives
- Experimental Next.js 16 features enabled
- Product page pre-generation
- Optimized cart revalidation

### 🛠️ Technical Enhancements

**Cart State Management**:
- Added `revalidatePath('/', 'layout')` to cart actions
- Ensures cart updates without hard refresh
- Fixed cart count and line item updates

**Caching Strategy**:
- `experimental.cacheComponents: true`
- `'use cache'` directives on data fetching
- Granular cache control with `cacheTag` and `cacheLife`

**TypeScript**:
- Custom types for Tailwind UI components
- Strict type checking throughout

## Dependencies

### Added
- `@vercel/speed-insights` - Performance monitoring

### Removed
- `sonner` - Replaced with custom toast/notification approach

### Key Dependencies
- `@headlessui/react` - Accessible UI components
- `@heroicons/react` - Icon library
- `clsx` - Conditional CSS classes
- `geist` - Vercel's font family

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Shopify store with Storefront API access

### Environment Variables

Create a `.env.local` file with the following variables:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
SITE_NAME=Your Store Name
COMPANY_NAME=Your Company
SHOPIFY_REVALIDATION_SECRET=your_webhook_secret
```

See [`.env.example`](.env.example) for more details.

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## Key Features

### User-Facing
- ✨ Modern, polished UI with Tailwind UI components
- 🔍 Instant search with command palette (⌘K)
- 🛒 Smooth cart experience with optimistic updates
- 📱 Fully responsive design
- ♿ Accessible components with keyboard navigation
- 🖼️ Optimized images with Next.js Image
- ⚡ Lightning-fast page loads with static generation

### Developer Experience
- 🏗️ Type-safe with TypeScript
- 🎯 React Server Components
- 🔄 Server Actions for mutations
- 📦 Organized component structure
- 🧩 Reusable utility functions
- 🎨 Tailwind CSS with custom configuration
- 🚀 Next.js 16 experimental features

## Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── (store)/                  # Store route group
│   │   ├── products/             # Product catalog pages
│   │   └── search/               # Search pages
│   ├── product/[handle]/         # Individual product pages
│   └── page.tsx                  # Home page
├── components/
│   ├── cart/                     # Shopping cart components
│   ├── home/                     # Home page sections
│   ├── layout/                   # Navigation, footer, etc.
│   ├── price/                    # Price display components
│   ├── product/                  # Product detail components
│   └── search-command/           # Command palette search
├── lib/
│   ├── shopify/                  # Shopify integration
│   └── utils.ts                  # Transformation utilities
└── next.config.ts                # Next.js configuration
```

## Configuration

### Next.js Config

Key experimental features enabled:

```typescript
experimental: {
  cacheComponents: true,    // Enable cache components
  inlineCss: true,          // Inline CSS optimization
  useCache: true            // Enable 'use cache' directive
}
```

### Static Generation

Product pages are statically generated at build time using `generateStaticParams`:

```typescript
export async function generateStaticParams() {
  const products = await getProducts({});
  return products.map((product) => ({
    handle: product.handle
  }));
}
```

## Performance Optimizations

- **Static Generation**: Product pages pre-rendered at build time
- **Optimistic UI**: Instant feedback on cart actions
- **Image Optimization**: Next.js Image with AVIF/WebP formats
- **Code Splitting**: Automatic route-based code splitting
- **Cache Control**: Granular caching with tags and lifecycles
- **React 19**: Leverages latest React performance features

## Shopify Integration

Uses Shopify Storefront API for:
- Product catalog
- Collections/categories
- Cart management
- Checkout

See the [official integration guide](https://vercel.com/docs/integrations/ecommerce/shopify) for setup details.

## Contributing

This is a customized template. For the base Next.js Commerce project, see [vercel/commerce](https://github.com/vercel/commerce).

## License

MIT - Based on Vercel's Next.js Commerce (MIT)

## Acknowledgments

- [Vercel](https://vercel.com) - Next.js Commerce template
- [Tailwind Labs](https://tailwindui.com) - Tailwind UI components
- [Shopify](https://shopify.com) - Commerce platform

---

Built with ❤️ using Next.js, React, and Tailwind CSS
