import type { Collection as TailwindCollection, Product as TailwindProduct } from 'components/storefront/types';
import { ReadonlyURLSearchParams } from 'next/navigation';
import type { Collection, Menu, Product } from './shopify/types';

export const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    'SHOPIFY_STORE_DOMAIN',
    'SHOPIFY_STOREFRONT_ACCESS_TOKEN'
  ];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        '\n'
      )}\n`
    );
  }

  if (
    process.env.SHOPIFY_STORE_DOMAIN?.includes('[') ||
    process.env.SHOPIFY_STORE_DOMAIN?.includes(']')
  ) {
    throw new Error(
      'Your `SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.'
    );
  }
};

// Transform Shopify Product to Tailwind Product format
export const transformShopifyProductToTailwind = (product: Product): TailwindProduct => {
  // Extract color variants from product variants where option name is "Color"
  const colorOptions = product.variants
    .map((variant) => {
      const colorOption = variant.selectedOptions.find(
        (option) => option.name.toLowerCase() === 'color'
      );
      return colorOption ? colorOption.value : null;
    })
    .filter((value, index, self) => value && self.indexOf(value) === index); // unique values only

  // Map colors to format expected by Tailwind component
  const availableColors = colorOptions.map((colorName) => ({
    name: colorName as string,
    colorBg: getColorHex(colorName as string), // Helper to convert color names to hex
  }));

  // Get first variant's color for the default display
  const firstColorOption = product.variants[0]?.selectedOptions.find(
    (option) => option.name.toLowerCase() === 'color'
  );
  const defaultColor = firstColorOption?.value || '';

  // Format price with currency symbol
  const price = product.variants[0]?.price
    ? `$${parseFloat(product.variants[0].price.amount).toFixed(2)}`
    : '$0.00';

  return {
    id: parseInt(product.id.replace(/\D/g, '')) || Math.floor(Math.random() * 100000), // Extract numeric ID or generate random
    name: product.title,
    color: defaultColor,
    price,
    href: `/product/${product.handle}`,
    imageSrc: product.images[0]?.url || 'https://via.placeholder.com/400',
    imageAlt: product.images[0]?.altText || product.title,
    availableColors: availableColors.length > 0 ? availableColors : [],
  };
};

// Transform Shopify Collection to Tailwind Collection format
export const transformShopifyCollectionToTailwind = (collection: Collection): TailwindCollection => {
  return {
    name: collection.title,
    description: collection.description || collection.seo.description,
    imageSrc: collection.image?.url || 'https://via.placeholder.com/800',
    imageAlt: collection.image?.altText || collection.title,
    href: collection.path,
  };
};

// Helper function to convert color names to hex codes
// This is a simple implementation - you can expand with more colors as needed
const getColorHex = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    black: '#111827',
    white: '#FFFFFF',
    gray: '#6B7280',
    grey: '#6B7280',
    red: '#DC2626',
    blue: '#2563EB',
    green: '#059669',
    yellow: '#F59E0B',
    orange: '#EA580C',
    purple: '#9333EA',
    pink: '#EC4899',
    brown: '#7C2D12',
    beige: '#FEF3C7',
    navy: '#1E3A8A',
    cream: '#FEF3C7',
    tan: '#D2B48C',
    olive: '#6B7237',
    maroon: '#7F1D1D',
    teal: '#0D9488',
    indigo: '#4F46E5',
    brass: '#FDE68A',
    chrome: '#E5E7EB',
    natural: '#FEF3C7',
    salmon: '#FA8072',
    matte: '#4B5563',
  };

  const normalizedColor = colorName.toLowerCase().trim();
  return colorMap[normalizedColor] || '#9CA3AF'; // Default gray if color not found
};

// Transform Shopify Menu items to footer navigation format
export const transformMenuToFooterNav = (menu: Menu[]): { name: string; href: string; }[] => {
  return menu.map((item) => ({
    name: item.title,
    href: item.path,
  }));
};

// Transform Shopify Collections to footer products format
export const transformCollectionsToFooterProducts = (collections: Collection[]): { name: string; href: string; }[] => {
  return collections.map((collection) => ({
    name: collection.title,
    href: collection.path,
  }));
};
