import { Suspense } from 'react';
import NavbarData from './navbar-data';

export default async function Navbar() {
  'use cache'
  return (
    <Suspense fallback={null}>
      <NavbarData />
    </Suspense>
  );
}


