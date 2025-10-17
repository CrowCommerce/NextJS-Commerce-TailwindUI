import { getCollections } from 'lib/shopify';
import { Suspense } from 'react';
import MobileFilters from './mobile-filters';

async function MobileFiltersList() {
  const collections = await getCollections();
  const collectionsWithLinks = collections.map((collection) => ({
    name: collection.title,
    href: collection.handle ? `/search/${collection.handle}` : '/search',
  }));
  
  return <MobileFilters collections={collectionsWithLinks} />;
}

export default function MobileFiltersWrapper() {
  return (
    <Suspense fallback={null}>
      <MobileFiltersList />
    </Suspense>
  );
}

