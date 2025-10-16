import { CartInitializer } from 'components/cart/cart-initializer';
import { GeistSans } from 'geist/font/sans';
import { getCart } from 'lib/shopify';
import { baseUrl } from 'lib/utils';
import { Metadata } from 'next';
import { ReactNode, Suspense } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

import TailwindFooter from 'components/layout/tailwind-footer';
import TailwindNavbar from 'components/layout/tailwind-navbar';

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
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <Suspense fallback={null}>
          <CartInitializer cartPromise={cart} />
        </Suspense>
        <TailwindNavbar />
        <main>
          {children}
          <Toaster closeButton />
        </main>
        <TailwindFooter />
      </body>
    </html>
  );
}
