import type { CategoryProduct } from './types';

interface ProductGridProps {
  products: CategoryProduct[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p>No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:col-span-3 lg:gap-x-8">
      {products.map((product) => (
        <a key={product.id} href={product.href} className="group text-sm">
          <img
            alt={product.imageAlt}
            src={product.imageSrc}
            className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
          />
          <h3 className="mt-4 font-medium text-gray-900">{product.name}</h3>
          <p className="text-gray-500 italic">{product.availability}</p>
          <p className="mt-2 font-medium text-gray-900">{product.price}</p>
        </a>
      ))}
    </div>
  );
}

