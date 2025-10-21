'use client';

import { ProductInitializer } from 'components/product/product-initializer';
import ProductWrapper from 'components/product/product-wrapper';
import { Product } from 'lib/shopify/types';
import { baseUrl, transformShopifyProductToTailwindDetail } from 'lib/utils';
import { notFound } from 'next/navigation';
import { use, type ReactNode } from 'react';

export function ProductPageContent({
  productPromise,
  relatedProductsSlot
}: {
  productPromise: Promise<Product | undefined>;
  relatedProductsSlot: ReactNode;
}) {
  const product = use(productPromise);

  if (!product) return notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${baseUrl}/products` },
      { '@type': 'ListItem', position: 3, name: product.title, item: `${baseUrl}/product/${product.handle}` }
    ]
  };

  // Transform product for Tailwind component
  const transformedProduct = transformShopifyProductToTailwindDetail(product);

  return (
    <div className="bg-white pb-24">
      <ProductInitializer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd)
        }}
      />
      <ProductWrapper product={product} transformedProduct={transformedProduct} />
      {relatedProductsSlot}
    </div>
  );
}

