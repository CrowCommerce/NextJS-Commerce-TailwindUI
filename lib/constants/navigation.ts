/**
 * Navigation Constants
 *
 * Single source of truth for all navigation items used across
 * desktop and mobile menus. These serve as fallback values when
 * Shopify navigation metaobjects are not configured.
 */

export type NavigationLink = {
  name: string;
  href: string;
  external?: boolean;
};

export type NavigationCategory = {
  name: string;
  featured: NavigationLink[];
  categories: NavigationLink[];
  collection: NavigationLink[];
  brands: NavigationLink[];
};

export type Navigation = {
  categories: NavigationCategory[];
  pages: NavigationLink[];
};

/**
 * Default navigation structure
 * Used as fallback when Shopify metaobjects are not configured
 */
export const DEFAULT_NAVIGATION: Navigation = {
  categories: [
    {
      name: "Women",
      featured: [
        { name: "Sleep", href: "/products" },
        { name: "Swimwear", href: "/products" },
        { name: "Underwear", href: "/products" },
      ],
      categories: [
        { name: "Basic Tees", href: "/products" },
        { name: "Artwork Tees", href: "/products" },
        { name: "Bottoms", href: "/products" },
        { name: "Underwear", href: "/products" },
        { name: "Accessories", href: "/products" },
      ],
      collection: [
        { name: "Everything", href: "/products" },
        { name: "Core", href: "/products" },
        { name: "New Arrivals", href: "/products" },
        { name: "Sale", href: "/products" },
      ],
      brands: [
        { name: "Full Nelson", href: "/products" },
        { name: "My Way", href: "/products" },
        { name: "Re-Arranged", href: "/products" },
        { name: "Counterfeit", href: "/products" },
        { name: "Significant Other", href: "/products" },
      ],
    },
    {
      name: "Men",
      featured: [
        { name: "Casual", href: "/products" },
        { name: "Boxers", href: "/products" },
        { name: "Outdoor", href: "/products" },
      ],
      categories: [
        { name: "Artwork Tees", href: "/products" },
        { name: "Pants", href: "/products" },
        { name: "Accessories", href: "/products" },
        { name: "Boxers", href: "/products" },
        { name: "Basic Tees", href: "/products" },
      ],
      collection: [
        { name: "Everything", href: "/products" },
        { name: "Core", href: "/products" },
        { name: "New Arrivals", href: "/products" },
        { name: "Sale", href: "/products" },
      ],
      brands: [
        { name: "Full Nelson", href: "/products" },
        { name: "My Way", href: "/products" },
        { name: "Re-Arranged", href: "/products" },
        { name: "Counterfeit", href: "/products" },
        { name: "Significant Other", href: "/products" },
      ],
    },
  ],
  pages: [
    { name: "Company", href: "/search" },
    { name: "Stores", href: "/search" },
  ],
};

/**
 * Utility navigation items
 * Used for account, support, etc.
 */
export const UTILITY_NAV: NavigationLink[] = [
  { name: "Account", href: "/account" },
  { name: "Support", href: "/support" },
];
