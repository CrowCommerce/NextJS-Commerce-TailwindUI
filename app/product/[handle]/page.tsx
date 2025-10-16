import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProductInitializer } from 'components/product/product-initializer';
import TailwindProductWrapper from 'components/product/tailwind-product-wrapper';
import TailwindRelatedProducts from 'components/product/tailwind-related-products';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getProduct, getProductRecommendations } from 'lib/shopify';
import {
  transformShopifyProductToTailwindDetail,
  transformShopifyProductsToRelatedProducts
} from 'lib/utils';
import { Suspense } from 'react';

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

export default async function ProductPage(props: { params: Promise<{ handle: string }> }) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
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

  // Transform product for Tailwind component
  const transformedProduct = transformShopifyProductToTailwindDetail(product);

  return (
    <div className="bg-white">
      <ProductInitializer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <TailwindProductWrapper product={product} transformedProduct={transformedProduct} />
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Customers also bought</h2>
            <div className="h-24 animate-pulse rounded bg-gray-200" />
          </div>
        }
      >
        <RelatedProducts id={product.id} />
      </Suspense>
    </div>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  // Transform products for Tailwind component
  const transformedRelatedProducts = transformShopifyProductsToRelatedProducts(relatedProducts);

  return <TailwindRelatedProducts products={transformedRelatedProducts} />;
}
