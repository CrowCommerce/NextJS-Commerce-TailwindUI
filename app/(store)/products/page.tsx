import TailwindProductGrid from 'components/layout/tailwind-product-grid';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/shopify';
import { baseUrl } from 'lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse all products.',
  alternates: { canonical: '/products' }
};

export default async function ProductsPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort } = (searchParams || {}) as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse });

  return (
    <div>
      {products.length > 0 ? <TailwindProductGrid products={products} /> : null}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: products.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${baseUrl}/product/${p.handle}`
            }))
          })
        }}
      />
    </div>
  );
}


