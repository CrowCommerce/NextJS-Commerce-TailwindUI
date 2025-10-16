import { getCollections } from 'lib/shopify';
import { Suspense } from 'react';
import ChildrenWrapper from './children-wrapper';
import LayoutWrapper from './layout-wrapper';

async function buildCollectionLinks() {
  const collections = await getCollections();
  return collections.map((collection) => ({
    name: collection.title,
    href: collection.handle ? `/tailwind-search/${collection.handle}` : '/tailwind-search',
  }));
}

export default async function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collections = await buildCollectionLinks();

  return (
    <LayoutWrapper collections={collections}>
      <Suspense fallback={null}>
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </Suspense>
    </LayoutWrapper>
  );
}
