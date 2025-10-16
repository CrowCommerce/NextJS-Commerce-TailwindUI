import Hero from 'components/home/hero';
import { Metadata } from 'next';

export const metadata: Metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <>
      <Hero />
    </>
  );
}
