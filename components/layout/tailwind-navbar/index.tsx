import { Suspense } from 'react';
import NavbarData from './navbar-data';
import NavbarSkeleton from './navbar-skeleton';

export default async function TailwindNavbar() {
  return (
    <Suspense fallback={<NavbarSkeleton />}>
      {/* The async fetch happens inside this child server component */}
      <NavbarData />
    </Suspense>
  );
}
