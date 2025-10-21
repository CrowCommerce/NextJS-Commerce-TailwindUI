import { GeistSans } from 'geist/font/sans';
import { baseUrl } from 'lib/utils';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';

import Cart from 'components/cart';
import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';
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
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-neutral-50 ">
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
