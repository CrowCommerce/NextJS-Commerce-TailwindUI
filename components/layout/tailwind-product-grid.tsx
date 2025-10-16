import { Product } from 'lib/shopify/types';
import Link from 'next/link';

export default function TailwindProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.handle}`} className="group">
          <img
            alt={product.featuredImage?.altText || product.title}
            src={product.featuredImage?.url || 'https://via.placeholder.com/400'}
            className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75"
          />
          <h3 className="mt-4 text-sm text-gray-700">{product.title}</h3>
          <p className="mt-1 text-lg font-medium text-gray-900">
            ${parseFloat(product.priceRange.maxVariantPrice.amount).toFixed(2)}
          </p>
        </Link>
      ))}
    </div>
  );
}

