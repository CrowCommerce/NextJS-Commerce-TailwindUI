# Next.js Commerce × Tailwind UI - Comprehensive Architecture Report

## Executive Summary

This is a production-ready, server-rendered Next.js 16 ecommerce application built on Vercel's Commerce template and enhanced with premium Tailwind UI components. The project demonstrates modern e-commerce best practices with a focus on performance, accessibility, and developer experience.

**Key Statistics:**
- **Framework:** Next.js 16 (canary) with App Router
- **React Version:** React 19 with Server Components and Server Actions
- **Styling:** Tailwind CSS v4 with @tailwindcss plugins
- **State Management:** Zustand, React Context API, useOptimistic (React 19)
- **Backend:** Shopify Storefront API (GraphQL)
- **Type Safety:** TypeScript with strict mode enabled
- **Code Size:** ~42KB of core components, 244KB cart context, 636KB Shopify integration

---

## 1. ROUTING ARCHITECTURE

### Router Type: **App Router (Next.js 16)**
The project uses Next.js App Router with a structured directory organization strategy.

### Route Structure

```
app/
├── layout.tsx                    # Root layout (Cart + Search providers)
├── globals.css                   # Global Tailwind styles
├── page.tsx                      # Home page (/)
├── robots.ts                     # SEO robots configuration
├── sitemap.ts                    # XML sitemap generation
├── error.tsx                     # Error boundary
│
├── (store)/                      # Route group for logical separation
│   ├── layout.tsx                # Store-specific layout wrapper
│   ├── products/
│   │   ├── page.tsx              # All products (/products)
│   │   └── [collection]/page.tsx  # Collection filtered (/products/[collection])
│   └── search/
│       ├── page.tsx              # Search results (/search)
│       ├── [collection]/page.tsx  # Collection search (/search/[collection])
│       ├── opengraph-image.tsx    # Dynamic OG images
│       └── shared/
│           ├── children-wrapper.tsx
│           └── search-header.tsx
│
├── product/
│   └── [handle]/
│       ├── page.tsx              # Product detail pages (static generation)
│       └── opengraph-image.tsx    # Dynamic OG image
│
├── [page]/                       # Dynamic Shopify pages
│   ├── layout.tsx
│   └── page.tsx
│
└── api/
    └── revalidate/route.ts       # Webhook for on-demand revalidation
```

### Route Patterns and Key Features

#### 1. **Root Layout** (`app/layout.tsx`)
- Applies global providers: `CartProvider`, `SearchProvider`
- Renders global components: `Navbar`, `Footer`, `SearchDialog`
- Uses GeistSans font from Vercel
- Sets up metadata with `metadataBase` for SEO

#### 2. **Store Route Group** (`app/(store)/`)
- Logical organization without affecting URL structure
- Shares store-specific layout across products and search routes
- Follows Tailwind UI design system throughout

#### 3. **Product Pages** (`app/product/[handle]/`)
- **Static Generation Strategy**: Uses `generateStaticParams()` to pre-render all products at build time
- Dramatically improves performance vs. dynamic generation
- Fetches product promise without awaiting (lazy loading pattern)
- Suspense boundary for related products section

#### 4. **Collections/Filtering** (`app/(store)/products/[collection]/`)
- Maps Shopify collections to `/products/[collection]` routes
- Supports sorting (via `?sort=slug` query param)
- Revalidates via Shopify webhooks to `/api/revalidate`

#### 5. **Search Routes** (`app/(store)/search/`)
- Query-based search with `?q=` parameter
- Optional collection filtering: `/search/[collection]?q=query`
- Client-side search component with command palette

#### 6. **Dynamic Pages** (`app/[page]/`)
- Catch-all for Shopify pages (About, Contact, Terms, etc.)
- Used for dynamic content pages from Shopify

#### 7. **API Routes** (`app/api/`)
- **POST /api/revalidate** - Shopify webhook handler
  - Validates webhook secret
  - Triggers cache revalidation for products/collections
  - Responds 200 to prevent Shopify retry loops

### URL Rewriting Strategy

- Shopify URLs `/collections/*` are conceptually mapped to `/products/*`
- Menu items redirect from old Shopify collection URLs
- Getters (e.g., `getMenu()`) transform URLs: `.replace('/collections', '/products')`

---

## 2. COMPONENT ARCHITECTURE

### Design Principles

1. **Separation of Concerns**: Context-specific components (e.g., different Price components)
2. **Server/Client Split**: Strategic use of `'use client'` boundaries
3. **Reusable Patterns**: Headless UI components + custom styling
4. **Type Safety**: Every component has TypeScript interfaces

### Component Organization

```
components/
├── cart/
│   ├── cart-context.tsx           # Cart state management (useOptimistic)
│   ├── actions.ts                 # Server Actions for cart mutations
│   ├── add-to-cart.tsx            # "Add to cart" button form
│   ├── index.tsx                  # Cart drawer with Dialog
│   ├── delete-item-button.tsx     # Line item deletion
│   ├── edit-item-quantity-button.tsx # Quantity adjustment
│   └── cart-price.tsx             # Price display in cart
│
├── product/
│   ├── product-context.tsx        # Product variant selection state
│   ├── product-detail.tsx         # Rich product detail component
│   ├── product-page-content.tsx   # Server component orchestrator
│   ├── product-wrapper.tsx        # Client component wrapper
│   ├── template-variant-selector.tsx # Variant button grid
│   └── related-products.tsx       # "Customers also bought" section
│
├── price/
│   ├── product-grid-price.tsx     # Grid/catalog view pricing
│   ├── product-detail-price.tsx   # Product detail page pricing
│   └── cart-price.tsx             # Shopping cart pricing
│
├── layout/
│   ├── navbar/
│   │   ├── index.tsx              # Navbar Suspense wrapper
│   │   ├── navbar-data.tsx        # Server component (fetches navigation)
│   │   ├── navbar-client.tsx      # Client component hydrator
│   │   ├── navbar-desktop.tsx     # Desktop navigation with Popover
│   │   ├── navbar-mobile.tsx      # Mobile navigation with Dialog
│   │   └── navbar-skeleton.tsx    # Loading skeleton
│   ├── footer/
│   │   ├── index.tsx
│   │   ├── footer-navigation.tsx
│   │   ├── footer-copyright.tsx
│   │   └── footer-newsletter.tsx
│   ├── search/
│   │   ├── collections.tsx        # Collection filtering sidebar
│   │   ├── sort-filter.tsx        # Sort/filter UI
│   │   ├── sort-filter-menu.tsx   # Sort dropdown
│   │   ├── mobile-filters.tsx     # Mobile filter drawer
│   │   └── mobile-filters-wrapper.tsx
│   ├── breadcrumbs.tsx            # Product page breadcrumbs
│   ├── product-grid.tsx           # Reusable grid layout
│   └── footer/
│
├── home/
│   ├── hero.tsx                   # Full-width hero section
│   ├── trending-products.tsx      # Trending/featured products (79 lines)
│   ├── collections.tsx            # Collection cards (42 lines)
│   └── types.ts                   # Tailwind UI component types
│
├── search-command/
│   ├── index.tsx                  # Search dialog + provider
│   ├── use-search.tsx             # Custom hook for search
│   ├── product-result.tsx         # Individual product search result
│   ├── search-button.tsx          # Command palette trigger
│   └── actions.ts                 # Server-side search action
│
├── category/
│   ├── category-header.tsx
│   ├── product-grid.tsx
│   └── types.ts
│
└── [utility components]
    ├── template-loading-dots.tsx  # Loading indicator
    ├── template-prose.tsx         # Rich text rendering
    └── template-opengraph-image.tsx # OG image generator
```

### Key Component Composition Patterns

#### Pattern 1: Server/Client Hybrid (Product Detail Page)

```typescript
// Server Component: app/product/[handle]/page.tsx
export default async function ProductPage() {
  const productPromise = getProduct(params.handle); // Lazy load
  return <ProductPageContent productPromise={productPromise} />;
}

// Client Component: ProductPageContent
export function ProductPageContent({ productPromise }) {
  // Wraps async logic for client components
}
```

#### Pattern 2: Context-Specific Prices

Each context uses a different price component to maintain design consistency:

```typescript
// Grid view - compact
<ProductGridPrice amount={product.price} currencyCode="USD" />

// Detail view - prominent
<ProductDetailPrice amount={product.price} currencyCode="USD" />

// Cart view - styled for cart context
<CartPrice amount={item.cost.totalAmount.amount} />
```

#### Pattern 3: Optimistic State Updates

```typescript
// In cart-context.tsx
const [optimisticCart, addOptimisticItem] = useOptimistic(cart, (state, newItem) => ({
  ...state,
  lines: [...state.lines, newItem]
}));
```

#### Pattern 4: Variant Selection State Management

```typescript
// ProductContext stores variant selections
const { state, updateOption } = useProduct();
// state = { color: 'black', size: 'M' }

// URL is kept in sync
const updateURL = useUpdateURL();
updateURL(newState); // Pushes to ?color=black&size=M
```

#### Pattern 5: Dialog Components with Headless UI

```typescript
// Cart Drawer
<Dialog open={isOpen} onClose={closeCart}>
  <DialogBackdrop transition /> {/* Backdrop with animation */}
  <DialogPanel transition> {/* Panel with slide animation */}
    {/* Content */}
  </DialogPanel>
</Dialog>
```

---

## 3. DATA FETCHING & API PATTERNS

### Shopify GraphQL Integration

**Client:** `lib/shopify/index.ts` - `shopifyFetch()` utility

```typescript
async function shopifyFetch<T>({
  headers,
  query,
  variables
}: {
  headers?: HeadersInit;
  query: string;
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T }>
```

**Key Features:**
- Generic type inference from GraphQL operation types
- Automatic token injection via `X-Shopify-Storefront-Access-Token` header
- Error handling with custom error shape
- Uses `node-fetch` compatible API

### Data Fetching Patterns

#### 1. **Static Data with Cache Directives** (Products, Collections)

```typescript
export async function getProduct(handle: string): Promise<Product | undefined> {
  'use cache';                           // Enable caching
  cacheTag(TAGS.products);               // Tag for revalidation
  cacheLife('days');                     // Cache duration
  
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    variables: { handle }
  });
  
  return reshapeProduct(res.body.data.product, false);
}
```

**Cache Tags Defined** (`lib/constants.ts`):
```typescript
export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart'
};
```

#### 2. **Dynamic Cart Data** (No cache - real-time)

```typescript
export async function getCart(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get('cartId')?.value;
  
  if (!cartId) return undefined;
  
  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId }
  });
  
  return reshapeCart(res.body.data.cart);
}
```

#### 3. **Server Actions for Mutations**

```typescript
// components/cart/actions.ts
'use server';

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined
) {
  try {
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    revalidateTag(TAGS.cart, 'max');      // Invalidate cart cache
    revalidatePath('/', 'layout');        // Revalidate layout (critical!)
  } catch (e) {
    return 'Error adding item to cart';
  }
}
```

**Critical Pattern:** Cart actions call **both**:
- `revalidateTag()` - Clears cached cart data
- `revalidatePath('/', 'layout')` - Forces root layout re-render for cart count update

### GraphQL Query Organization

**Structure:**
- `lib/shopify/fragments/` - Reusable GraphQL fragments
- `lib/shopify/queries/` - Data fetching queries
- `lib/shopify/mutations/` - Data mutations (cart operations)

**Example Fragment** (`lib/shopify/fragments/product.ts`):
```typescript
const productFragment = `
  fragment product on Product {
    id
    handle
    title
    description
    options {
      id
      name
      values
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
    images(first: 100) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    featuredImage {
      ...
    }
    seo {
      title
      description
    }
  }
`;
```

### Data Transformation Utilities

**File:** `lib/utils.ts` provides Shopify → Tailwind UI transformations:

```typescript
// Shopify → Grid Product format
export function transformShopifyProductToTailwind(product: Product): TailwindProduct {
  // Extracts color variants
  // Maps to Tailwind color swatches
  // Returns grid-friendly structure
}

// Shopify → Detail Page format
export function transformShopifyProductToTailwindDetail(product: Product): TailwindProductDetail {
  // Full product data for detail view
  // Includes images, colors, descriptions
  // Pre-populates details sections
}

// Shopify → Related Products format
export function transformShopifyProductsToRelatedProducts(products: Product[]): TailwindRelatedProduct[] {
  // First 4 products only
  // Minimal fields for carousel display
}
```

### Caching Strategy

**Experimental Next.js 16 Features:**
```typescript
// next.config.ts
experimental: {
  cacheComponents: true,    // Cache RSC payload
  inlineCss: true,          // Inline critical CSS
  useCache: true            // Enable 'use cache' directive
}
```

**Revalidation Triggers:**
1. **Webhook Handler** (`/api/revalidate`) triggered by Shopify webhooks
2. **On-demand** via `revalidateTag()` in Server Actions
3. **Time-based** via `cacheLife('days')`

---

## 4. STATE MANAGEMENT

### Multi-Layer State Architecture

#### Layer 1: React Context + useOptimistic (Product Variants)

```typescript
// ProductContext (product-context.tsx)
- Manages: variant selections (color, size, etc.)
- Storage: URL search params + React state
- Pattern: useOptimistic for instant UI feedback
- Scope: Single product page
```

**Usage:**
```typescript
const { state, updateOption, updateImage } = useProduct();
// state = { color: 'black', size: 'M', image: '2' }

// Update with instant UI feedback
const newState = updateOption('color', 'red');
updateURL(newState); // Sync to URL
```

#### Layer 2: React Context + useOptimistic (Shopping Cart)

```typescript
// CartContext (cart-context.tsx)
- Manages: cart items, totals, quantities
- Storage: Server state (cookies) + React optimistic state
- Pattern: useOptimistic for instant add/remove
- Scope: Global (layout-level)
```

**Key Methods:**
```typescript
const { cart, updateCartItem, addCartItem } = useCart();

// Optimistic operations
updateCartItem(merchandiseId, 'plus');  // Instantly increment
addCartItem(variant, product);           // Add with UI feedback
```

**Cart Structure:**
```typescript
type Cart = {
  id: string;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: CartItem[];
  totalQuantity: number;
};
```

#### Layer 3: Server State (Cookies + Database)

**Cart ID Storage:**
```typescript
// Set on cart creation
(await cookies()).set('cartId', cart.id);

// Read on subsequent requests
const cartId = (await cookies()).get('cartId')?.value;
```

**Shopify handles:**
- Persistent cart state server-side
- Checkout URL generation
- Tax/shipping calculations

#### Layer 4: URL State (Search Params)

**Used for:**
- Product variant selections: `?color=black&size=M`
- Sorting/filtering: `?sort=price-asc`
- Search queries: `?q=blue+shoes`
- Pagination (future)

**Synced via:** `useRouter().push()` in `useUpdateURL()` hook

### No External State Management

The project does **not** use Redux, Zustand (despite being in package.json), or Jotai. Instead:
- React Context for cross-cutting state (Product, Cart)
- Server Actions for mutations
- URL for navigation state
- Cookies for persistent user data

This minimalist approach reduces complexity while leveraging React 19's built-in capabilities.

---

## 5. TAILWIND CONFIGURATION & DESIGN SYSTEM

### Tailwind CSS Version: **4.0.14**

### Configuration Files

#### PostCSS Config (`postcss.config.mjs`)
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  }
};
```

#### Global Styles (`app/globals.css`)

```css
@import 'tailwindcss';

@plugin "@tailwindcss/container-queries";
@plugin "@tailwindcss/typography";

@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: var(--color-gray-200, currentColor);
  }
}

/* Remove all focus visuals globally */
:is(button,[role="button"],a,input,select,textarea,summary):is(:focus,:focus-visible) {
  outline: none !important;
  box-shadow: none !important;
}

/* Fade in animation for product grids */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}
```

### Tailwind Plugins & Features

1. **@tailwindcss/container-queries** - Container query support
2. **@tailwindcss/typography** - Prose styling for rich text
3. **@tailwindcss/postcss** - Core Tailwind v4 engine

### Design System & Token Usage

#### Color System

**Palette:**
- `bg-gray-50` - Lightest backgrounds
- `bg-gray-500/75` - Semi-transparent overlays
- `bg-blue-600` - Primary action buttons
- `bg-indigo-600` - Secondary action / hover states
- `text-gray-900` - Primary text
- `text-gray-700` - Secondary text
- `text-gray-400` - Tertiary/disabled text

**Neutral Color Mapping** (`lib/utils.ts`):
```typescript
const colorMap: Record<string, string> = {
  black: '#111827',
  white: '#FFFFFF',
  gray: '#6B7280',
  blue: '#2563EB',
  indigo: '#4F46E5',
  // ... 20+ colors mapped for product variant swatches
};
```

#### Spacing System

Consistent use of Tailwind spacing scale:
- `px-4 sm:px-6 lg:px-8` - Responsive padding
- `gap-3`, `gap-8` - Component spacing
- `py-6 sm:py-8` - Vertical rhythm
- `mt-4 sm:mt-6` - Margin hierarchy

#### Typography

- **Headings**: `text-2xl font-bold`, `text-3xl tracking-tight`
- **Body**: `text-sm font-medium`, `text-base`
- **Links**: `text-indigo-600 hover:text-indigo-500`

#### Focus Management

**Global Focus Removal** (per design):
```css
/* Removes default focus rings */
:is(button,[role="button"],a):is(:focus,:focus-visible) {
  outline: none !important;
  box-shadow: none !important;
}
```

**Custom Focus Styles:**
```typescript
// Applied explicitly where needed
className="focus-visible:outline-2 focus-visible:outline-indigo-600"
```

#### Responsive Breakpoints

Standard Tailwind breakpoints:
- `hidden lg:block` - Desktop only
- `sm:px-6` - Small screens up
- `lg:grid lg:grid-cols-4` - Large screens up
- `container` - Max-width wrapper

### Custom Components Using Tailwind

**Button Patterns:**
```typescript
// Primary action
className="rounded-full bg-blue-600 px-4 py-3 text-white hover:opacity-90"

// Secondary action
className="border border-gray-300 px-4 py-2 hover:bg-gray-50"

// Disabled state
className="cursor-not-allowed opacity-60 hover:opacity-60"
```

**Card Patterns:**
```typescript
// Product card
className="rounded-lg border border-gray-200 hover:shadow-lg transition"

// Dialog panel
className="rounded-lg bg-white shadow-xl"
```

**Form Patterns:**
```typescript
// Input
className="block w-full px-4 py-2 border border-gray-300 rounded-lg"

// Checkbox
className="h-4 w-4 rounded border-gray-300"
```

---

## 6. CART IMPLEMENTATION

### Architecture Overview

The cart system combines:
1. **Server State** - Shopify-managed (persistent)
2. **Cookie Storage** - Cart ID persistence across sessions
3. **React Context** - Optimistic UI updates
4. **Server Actions** - Secure mutations

### Cart Flow Diagram

```
User Click "Add to Cart"
    ↓
AddToCart Component (Client)
    ├─ Collects variant selection
    └─ Calls Server Action: addItem()
        ↓
    Server Action (actions.ts)
    ├─ Validates variant
    ├─ Calls shopifyFetch() → addToCartMutation
    ├─ Shopify returns updated cart
    ├─ revalidateTag(TAGS.cart, 'max')     ← CRITICAL
    └─ revalidatePath('/', 'layout')       ← CRITICAL
        ↓
    Layout Re-renders
    ├─ CartProvider receives new cart
    ├─ Cart count updates
    └─ Auto-open cart drawer
```

### Cart Context Implementation

**File:** `components/cart/cart-context.tsx` (244 lines)

```typescript
type CartContextType = {
  cartPromise: Promise<Cart | undefined>;
};

// Passed from root layout
<CartProvider cartPromise={cartPromise}>
  {children}
</CartProvider>

// Used in components
const { cart, updateCartItem, addCartItem } = useCart();
```

**Key Methods:**

1. **updateCartItem()** - Optimistic quantity updates
```typescript
const optimisticCart = useOptimistic(cart, (state, action) => {
  // Instantly updates UI before server confirmation
});
```

2. **addCartItem()** - Adds item to optimistic state
```typescript
addCartItem(variant, product); // Adds to optimistic state
// Then Server Action confirms
```

### Cart Drawer Component

**File:** `components/cart/index.tsx` (256 lines)

**Features:**
- **Headless UI Dialog** for accessible modal
- **Auto-open on add** - Opens when totalQuantity increases
- **Slide-in animation** - Enters from right with transition
- **Item management** - Delete, quantity adjustment
- **Checkout redirect** - Button links to Shopify checkout

**Key Pattern:**
```typescript
// Auto-open on quantity increase
useEffect(() => {
  if (
    cart?.totalQuantity &&
    cart?.totalQuantity !== quantityRef.current &&
    cart?.totalQuantity > 0
  ) {
    if (!isOpen) {
      setIsOpen(true);
    }
    quantityRef.current = cart?.totalQuantity;
  }
}, [isOpen, cart?.totalQuantity]);
```

### Cart Mutations

**File:** `components/cart/actions.ts` (110 lines)

#### 1. Add Item
```typescript
export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined
) {
  await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
  revalidateTag(TAGS.cart, 'max');
  revalidatePath('/', 'layout');
}
```

#### 2. Remove Item
```typescript
export async function removeItem(prevState: any, merchandiseId: string) {
  const cart = await getCart();
  const lineItem = cart.lines.find(line => line.merchandise.id === merchandiseId);
  await removeFromCart([lineItem.id]);
  revalidateTag(TAGS.cart, 'max');
  revalidatePath('/', 'layout');
}
```

#### 3. Update Quantity
```typescript
export async function updateItemQuantity(
  prevState: any,
  payload: { merchandiseId: string; quantity: number }
) {
  const lineItem = cart.lines.find(line => line.merchandise.id === payload.merchandiseId);
  
  if (payload.quantity === 0) {
    await removeFromCart([lineItem.id]);
  } else {
    await updateCart([{ id: lineItem.id, merchandiseId, quantity }]);
  }
  
  revalidateTag(TAGS.cart, 'max');
  revalidatePath('/', 'layout');
}
```

### Cart Persistence

**Strategy:** Cookie-based cart ID persistence

```typescript
// On page load (layout.tsx)
const cartPromise = getCart();
// getCart() reads cart ID from cookies

// On cart creation (actions.ts)
export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set('cartId', cart.id!);
}

// Cookie automatically sent with all requests
// Shopify identifies cart by ID and maintains state
```

---

## 7. PRODUCT VARIANT SELECTOR PATTERNS

### Variant Architecture

**Shopify Product Structure:**
```typescript
type Product = {
  id: string;
  title: string;
  options: ProductOption[];           // "Color", "Size", etc.
  variants: ProductVariant[];         // All combinations
};

type ProductOption = {
  id: string;
  name: string;
  values: string[];                   // ["Red", "Blue", "Green"]
};

type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: Money;
};
```

### Variant Selection Flow

**File:** `components/product/template-variant-selector.tsx` (94 lines)

```typescript
export function VariantSelector({
  options,
  variants
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const { state, updateOption } = useProduct();
  const updateURL = useUpdateURL();
  
  // Skip if no options or only one option with one value
  if (options.length <= 1 && options[0]?.values.length <= 1) {
    return null;
  }
  
  // Build combination map for availability checking
  const combinations = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (acc, option) => ({ ...acc, [option.name.toLowerCase()]: option.value }),
      {}
    )
  }));
  
  return options.map((option) => (
    <form key={option.id}>
      <dl className="mb-8">
        <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
        <dd className="flex flex-wrap gap-3">
          {option.values.map((value) => {
            // Build new state with this value
            const optionParams = { ...state, [optionNameLowerCase]: value };
            
            // Check if combination exists and is available
            const filtered = Object.entries(optionParams).filter(([key, value]) =>
              options.find(
                (option) => option.name.toLowerCase() === key && option.values.includes(value)
              )
            );
            
            const isAvailableForSale = combinations.find((combination) =>
              filtered.every(
                ([key, value]) => combination[key] === value && combination.availableForSale
              )
            );
            
            const isActive = state[optionNameLowerCase] === value;
            
            return (
              <button
                formAction={() => {
                  const newState = updateOption(optionNameLowerCase, value);
                  updateURL(newState);
                }}
                disabled={!isAvailableForSale}
                title={`${option.name} ${value}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
                className={clsx(
                  'flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm',
                  {
                    'cursor-default ring-2 ring-blue-600': isActive,
                    'ring-1 ring-transparent transition hover:ring-blue-600': !isActive && isAvailableForSale,
                    'cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 before:bg-neutral-300 before:-rotate-45': !isAvailableForSale
                  }
                )}
              >
                {value}
              </button>
            );
          })}
        </dd>
      </dl>
    </form>
  ));
}
```

### Variant Selection States

**Button States:**

1. **Active** - Selected option
   - `ring-2 ring-blue-600`
   - `cursor-default`

2. **Available** - Can be selected
   - `ring-1 ring-transparent`
   - `hover:ring-blue-600` with transition
   - Clickable

3. **Out of Stock** - Unavailable combination
   - `cursor-not-allowed`
   - `text-neutral-500` (grayed)
   - Strikethrough via `before:bg-neutral-300 before:-rotate-45`
   - Disabled

### Add to Cart Integration

**File:** `components/cart/add-to-cart.tsx` (109 lines)

```typescript
export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state: productState } = useProduct();
  const [message, formAction] = useActionState(addItem, null);
  
  // Find variant matching current selections
  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === productState[option.name.toLowerCase()]
    )
  );
  
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  
  return (
    <form
      action={async () => {
        const finalVariant = variants.find(v => v.id === selectedVariantId)!;
        addCartItem(finalVariant, product);  // Optimistic update
        formAction();                        // Server Action
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
    </form>
  );
}

// Button states:
// - Product out of stock → "Out Of Stock" (disabled)
// - No variant selected → "Add To Cart" (disabled)
// - Ready → "Add To Cart" (enabled, blue)
```

---

## 8. COLLECTION & FILTERING PATTERNS

### Collection Architecture

**Routes:**
- `/products` - All products
- `/products/[collection]` - Collection filtered

**Filtering Strategy:**
- **Server-side** via Shopify query with `collection` parameter
- **Sorting** via URL params (`?sort=price-asc`)
- **Mobile filters** - Drawer UI for collection/sort selection

### Filtering Implementation

**File:** `components/layout/search/sort-filter-menu.tsx`

**Features:**
- Collections sidebar - Switch between collections
- Sort dropdown - 5 sort options:
  1. Relevance (default)
  2. Trending (best selling)
  3. Latest arrivals (created desc)
  4. Price: Low to high
  5. Price: High to low

**Sort Configuration** (`lib/constants.ts`):
```typescript
export const defaultSort = {
  title: 'Relevance',
  slug: null,
  sortKey: 'RELEVANCE',
  reverse: false
};

export const sorting = [
  defaultSort,
  { title: 'Trending', slug: 'trending-desc', sortKey: 'BEST_SELLING', reverse: false },
  { title: 'Latest arrivals', slug: 'latest-desc', sortKey: 'CREATED_AT', reverse: true },
  { title: 'Price: Low to high', slug: 'price-asc', sortKey: 'PRICE', reverse: false },
  { title: 'Price: High to low', slug: 'price-desc', sortKey: 'PRICE', reverse: true }
];
```

### Mobile Filter Drawer

**File:** `components/layout/search/mobile-filters.tsx`

```typescript
// Uses Headless UI Dialog for accessibility
<Dialog open={open} onClose={setOpen}>
  <DialogBackdrop /> {/* Overlay */}
  <DialogPanel> {/* Drawer content */}
    {/* Collections list */}
    {/* Sort dropdown */}
  </DialogPanel>
</Dialog>
```

### Collection Query

**File:** `lib/shopify/queries/collection.ts`

```typescript
export const getCollectionProductsQuery = `
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      products(
        first: 100
        sortKey: $sortKey
        reverse: $reverse
      ) {
        edges {
          node { ...product }
        }
      }
    }
  }
`;
```

**Supported Sort Keys:**
- `RELEVANCE` - Search relevance
- `BEST_SELLING` - Best selling products
- `CREATED` - Newest (maps from `CREATED_AT`)
- `PRICE` - Price (combined with `reverse` for direction)

---

## 9. ACCOUNT AREA PATTERNS

### Current Implementation Status

**The template does NOT currently implement:**
- User accounts/login
- Order history
- Saved addresses
- Wishlist
- Account dashboard

**Why:**
- Focuses on product discovery and cart
- Shopify handles checkout (Liquid)
- Account management typically handled post-checkout

**To Add (Pattern Guide):**

1. **User Authentication**
   - Use Shopify Customer API or third-party (Auth0, Firebase)
   - Create `app/(account)/` route group
   - Implement login/signup pages

2. **Order History**
   ```typescript
   // Server component fetching customer orders
   export async function OrderHistory({ customerId }) {
     const orders = await shopifyFetch<CustomerOrdersQuery>({
       query: getCustomerOrdersQuery,
       variables: { customerId }
     });
   }
   ```

3. **Account Routes**
   ```
   app/(account)/
   ├── login/page.tsx
   ├── register/page.tsx
   ├── profile/page.tsx
   ├── orders/page.tsx
   ├── addresses/page.tsx
   └── layout.tsx (with auth check)
   ```

---

## 10. ACCESSIBILITY PATTERNS

### Global Accessibility Configuration

**Disabled Focus Rings** (`app/globals.css`):
```css
/* Removes default focus indicators globally */
:is(button,[role="button"],a,input,select,textarea,summary):is(:focus,:focus-visible) {
  outline: none !important;
  box-shadow: none !important;
}
```

**Note:** This is a design choice prioritizing aesthetics; custom focus states are applied where necessary.

### Component-Level Accessibility

#### 1. **ARIA Attributes**

**Semantic HTML:**
```typescript
// Product Grid
<ul role="list"> {/* Explicit list semantics */}
  {products.map(product => (
    <li key={product.id}>{/* Item */}</li>
  ))}
</ul>

// Navigation Sections
<ul role="list" aria-labelledby={`heading-${id}`}>
  {items.map(item => <li>{item.name}</li>)}
</ul>
```

**Aria Labels:**
```typescript
<section aria-labelledby="trending-heading">
  <h2 id="trending-heading">Trending products</h2>
</section>

<h4 className="sr-only">Available colors</h4>
<ul role="list">
  {colors.map(color => (
    <li>
      <span className="sr-only">{color.name}</span>
    </li>
  ))}
</ul>
```

#### 2. **Screen Reader Text**

```typescript
// Show/hide from visual users but available to screen readers
<span className="sr-only">items in cart, view bag</span>
<span className="sr-only">Close panel</span>
<span className="sr-only">Search</span>
```

#### 3. **Keyboard Navigation**

**Search Dialog (Cmd+K):**
```typescript
useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setIsOpen(prev => !prev);
    }
  };
  document.addEventListener('keydown', down);
  return () => document.removeEventListener('keydown', down);
}, []);
```

**Variant Selection:**
- Tab through variant buttons
- Space/Enter to select
- Disabled variants get `aria-disabled="true"` + `disabled`
- Title attribute provides context: `"Color Red (Out of Stock)"`

**Product Detail Tabs:**
```typescript
<TabGroup>
  <TabList>
    {tabs.map(tab => (
      <Tab key={tab.name}>{tab.name}</Tab>
    ))}
  </TabList>
  <TabPanels>
    {tabs.map(tab => (
      <TabPanel key={tab.name}>{tab.content}</TabPanel>
    ))}
  </TabPanels>
</TabGroup>
```

#### 4. **Focus Management**

**Dialog Focus Trap** (Headless UI Dialog):
```typescript
<Dialog open={isOpen} onClose={closeCart}>
  <DialogBackdrop /> {/* Prevents interaction with content behind */}
  <DialogPanel>
    {/* Focus automatically trapped within dialog */}
  </DialogPanel>
</Dialog>
```

#### 5. **Color Accessibility**

**Variant Color Swatches:**
```typescript
// Provides visual color + text label
<li
  key={color.name}
  style={{ backgroundColor: color.colorBg }}
  className="size-4 rounded-full border"
>
  <span className="sr-only">{color.name}</span>
</li>
```

**Alternative for Better Contrast:**
```typescript
// Light colors get dark outline
className={`bg-[${hex}] ${isLight ? 'checked:outline-gray-400' : 'checked:outline-gray-700'}`}
```

#### 6. **Link Semantics**

```typescript
// Navigation links use proper semantics
<Link href={item.href}>
  {item.name}
</Link>

// Icon buttons have labels
<button
  aria-label="Add to cart"
  className="..."
>
  <PlusIcon /> Add To Cart
</button>
```

#### 7. **Form Accessibility**

```typescript
<form action={handleSubmit}>
  <div>
    <label htmlFor="email">Email</label>
    <input id="email" type="email" />
  </div>
  <button type="submit" aria-label="Subscribe to newsletter">
    Subscribe
  </button>
</form>
```

#### 8. **Live Regions**

```typescript
// Status updates announced to screen readers
<p aria-live="polite" className="sr-only" role="status">
  {message}
</p>
```

### Accessibility Gaps & Recommendations

**Current Limitations:**
1. Custom focus styles removed globally (requires reintroduction)
2. No explicit color contrast ratios tested
3. Navigation dropdown might need better keyboard support

**Recommended Improvements:**
```typescript
// Restore focus management while keeping design
button:focus-visible {
  outline: 2px solid #4F46E5;
  outline-offset: 2px;
}
```

---

## 11. UTILITY FUNCTIONS & HELPERS

### Data Transformation Utilities

**File:** `lib/utils.ts`

#### Price Formatting
```typescript
// Format price with currency
export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'narrowSymbol'
  }).format(parseFloat(amount));
}
```

#### Product Transformations
```typescript
transformShopifyProductToTailwind(product)     // Grid format
transformShopifyProductToTailwindDetail(product) // Detail format
transformShopifyProductsToRelatedProducts(products) // Carousel format
transformShopifyCollectionToTailwind(collection) // Collection card format
transformMenuToFooterNav(menu)               // Footer navigation
transformCollectionsToFooterProducts(collections) // Footer products
```

#### Color Mapping
```typescript
getColorHex(colorName: string): string  // Convert "Red" → "#DC2626"
isLightColor(hex: string): boolean      // Determine contrast color
```

#### URL & Routing
```typescript
createUrl(pathname: string, params: URLSearchParams): string
// Creates: "/products?color=black&size=M"

ensureStartsWith(str: string, prefix: string): string
// Ensures "example.com" → "https://example.com"

baseUrl: string
// "https://domain.com" or "http://localhost:3000"
```

#### Environment Variables
```typescript
validateEnvironmentVariables(): void
// Throws if required env vars missing
// Required: SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN
```

### Shopify Integration Helpers

**File:** `lib/shopify/index.ts`

#### Data Reshaping
```typescript
reshapeCart(cart: ShopifyCart): Cart
// Flattens edges/nodes structure

reshapeCollection(collection: ShopifyCollection): Collection | undefined
// Adds path field

reshapeProduct(product: ShopifyProduct, filterHiddenProducts): Product | undefined
// Reshapes images and variants

reshapeImages(images: Connection<Image>, productTitle: string): Image[]
// Generates alt text

removeEdgesAndNodes<T>(connection: Connection<T>): T[]
// Flattens: edges[].node → []
```

#### Navigation Management
```typescript
// Default navigation fallback
const DEFAULT_NAVIGATION: Navigation = {
  categories: [
    { name: 'Women', featured: [...], categories: [...], collection: [...], brands: [...] },
    { name: 'Men', ... }
  ],
  pages: [{ name: 'Company', href: '/company' }, ...]
}

// Handles Shopify metaobjects or uses DEFAULT_NAVIGATION
getNavigation(): Promise<Navigation>
```

### Type Guards

**File:** `lib/type-guards.ts`

```typescript
isShopifyError(error: unknown): error is ShopifyError
// Checks for Shopify error shape
```

---

## 12. TESTING & PERFORMANCE INSIGHTS

### Code Quality Tools

**Configured:**
- **Prettier 3.5.3** - Code formatting
- **TypeScript 5.8.2** - Type checking
- **ESLint** (via Next.js) - Linting

**Scripts:**
```bash
pnpm prettier        # Format all files
pnpm prettier:check  # Check formatting
pnpm test           # Runs prettier:check (no test suite)
pnpm dev --turbopack # Dev with Turbopack bundler
```

### Performance Features

1. **Static Generation**
   - All product pages pre-rendered at build time
   - `generateStaticParams()` fetches all products

2. **Image Optimization**
   - Next.js Image component with AVIF/WebP
   - Remote patterns configured for Shopify CDN
   - Lazy loading with clip-path fix (iOS)

3. **Code Splitting**
   - Route-based automatic splitting
   - Dynamic imports for heavy components

4. **Caching Strategy**
   - Server-side caching with `'use cache'`
   - `cacheLife('days')` for long-lived data
   - Granular revalidation via `cacheTag()`

5. **Optimistic Updates**
   - `useOptimistic` for instant UI feedback
   - No loading states for cart operations

6. **Turbopack Development**
   - `pnpm dev --turbopack` for faster builds
   - Instant refresh on file changes

### Monitoring

**Vercel Speed Insights:**
```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

// Automatically tracking:
// - Web Vitals (LCP, FID, CLS)
// - Performance metrics
// - Real user monitoring (RUM)
```

---

## 13. KEY REUSABLE PATTERNS FOR PORTING

### Pattern 1: Data Transformation Layer

**Applicable to:** Any headless CMS → component framework
```typescript
// Raw API data → Component-specific format
export function transform[Source]To[Target](data: Source): Target {
  return {
    // Map fields
    // Transform nested objects
    // Extract defaults
  };
}
```

**Benefits:**
- Decouples data source from components
- Easy to maintain multiple UI contexts
- Simple to add new formats

### Pattern 2: Optimistic Updates with useOptimistic

**Applicable to:** Any React 19 mutation (cart, wishlist, etc.)
```typescript
const [optimistic, action] = useOptimistic(
  initial,
  (state, update) => applyUpdate(state, update)
);

// Instant UI feedback
action(newData);
// Server Action confirms
await serverMutation(newData);
```

**Benefits:**
- No loading states needed
- Instant visual feedback
- Fallback on error

### Pattern 3: Context for Cross-Cutting State

**Applicable to:** Product selections, user preferences, theme
```typescript
const Context = createContext();

export function Provider({ children }) {
  const [state, setState] = useState();
  return <Context.Provider value={state}>{children}</Context.Provider>;
}

export function useMyContext() {
  return useContext(Context);
}
```

**Benefits:**
- Cleaner than prop drilling
- Lighter than Redux
- Combines well with Server Components

### Pattern 4: URL as State Management

**Applicable to:** Filters, sorts, variant selection
```typescript
// Persist state to URL for:
const updateURL = (state) => {
  const params = new URLSearchParams();
  Object.entries(state).forEach(([k, v]) => params.set(k, v));
  router.push(`?${params}`);
};

// Benefits:
// - Shareable URLs
// - Browser back/forward
// - Bookmarkable states
```

### Pattern 5: Server Actions for Mutations

**Applicable to:** Any data modification
```typescript
'use server';

export async function addItem(prevState, selectedId) {
  // Server-side mutation
  await db.mutation();
  // Revalidate
  revalidateTag('items');
}

// Benefits:
// - Type-safe
// - Secure (no API keys exposed)
// - Automatic form handling
```

### Pattern 6: Suspense for Async Components

**Applicable to:** Any slow async operation
```typescript
<Suspense fallback={<Skeleton />}>
  <AsyncComponent />
</Suspense>

// AsyncComponent can be async function:
export async function AsyncComponent() {
  const data = await fetch();
  return <div>{data}</div>;
}
```

**Benefits:**
- Progressive rendering
- No loading state boilerplate
- Clean component code

### Pattern 7: Route Groups for Organization

**Applicable to:** Logical grouping without URL impact
```
app/
├── (store)/           // Store pages share layout
├── (admin)/           // Admin pages share different layout
└── api/               // API routes
```

**Benefits:**
- Separate layouts per section
- Cleaner route organization
- No URL complexity

### Pattern 8: Headless UI for Accessible Components

**Applicable to:** Any complex interactive component
```typescript
import { Dialog, Tab, Popover } from '@headlessui/react';

// Use Headless UI instead of custom hooks:
// ✓ Keyboard navigation built-in
// ✓ Focus management automatic
// ✓ ARIA attributes included
// ✓ Mobile-friendly
```

---

## Summary: Key Takeaways for Architecture

### What Works Well
1. **Server Components** - Reduces client bundle
2. **Optimistic Updates** - Responsive UX without loading states
3. **URL State** - Shareable, bookmarkable product pages
4. **Transformation Layer** - Clean separation between data and UI
5. **Headless UI** - Accessible by default
6. **Static Generation** - Lightning-fast product pages

### Tradeoffs Made
1. **No Account System** - Shopify handles post-checkout
2. **No Wishlist** - Prioritizes core commerce
3. **No Reviews** - Would require additional backend
4. **Simple Search** - Real-time client-side (could use Algolia)
5. **Global Focus Styles Removed** - Design choice, but impacts accessibility

### Scalability Considerations
- **Data Fetching**: Current patterns scale to 1000+ products
- **Cart**: Shopify handles state, local optimistic updates scale
- **Images**: Shopify CDN with Next.js Image optimization
- **Build Time**: Product page generation (~1000s of pages in production)

---

## Technology Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js | 16.0.0-canary.6 |
| **React** | React | 19.0.0 |
| **UI Components** | Headless UI | 2.2.0 |
| **Icons** | Hero Icons | 2.2.0 |
| **Styling** | Tailwind CSS | 4.0.14 |
| **Commerce** | Shopify Storefront API | 2023-01 |
| **Language** | TypeScript | 5.8.2 |
| **Fonts** | Geist | 1.3.1 |
| **Utils** | clsx | 2.1.1 |
| **Speed Insights** | @vercel/speed-insights | 1.2.0 |
| **Formatting** | Prettier | 3.5.3 |

---

**Report Generated:** October 21, 2025
**Project Type:** Next.js 16 + React 19 + Tailwind CSS 4 + Shopify Storefront API
