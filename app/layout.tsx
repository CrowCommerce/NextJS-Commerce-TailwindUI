import { CartInitializer } from 'components/cart/cart-initializer';
import { GeistSans } from 'geist/font/sans';
import { getCart } from 'lib/shopify';
import { baseUrl } from 'lib/utils';
import { Metadata } from 'next';
import { ReactNode, Suspense } from 'react';
import './globals.css';

import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';
import Cart from 'components/cart';
import { SearchCommand } from 'components/search-command';

const { SITE_NAME } = process.env;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  }
};

export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the initializer
  const cart = getCart();

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-neutral-50 ">
        <Suspense fallback={null}>
          <CartInitializer cartPromise={cart} />
        </Suspense>
        <SearchCommand />
        <Navbar />
        <Cart />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
