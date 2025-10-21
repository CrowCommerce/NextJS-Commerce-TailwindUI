import { Suspense } from 'react';

const ProductPageSkeleton = () => (
  <div className="bg-white">
    <div className="mx-auto max-w-7xl animate-pulse sm:px-6 sm:pt-16 lg:px-8">
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image skeleton */}
          <div className="aspect-square w-full rounded-lg bg-gray-200" />
          
          {/* Product info skeleton */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            {/* Title */}
            <div className="mb-3 h-8 w-3/4 rounded bg-gray-200" />
            
            {/* Price */}
            <div className="mb-3 h-6 w-24 rounded bg-gray-200" />
            
            {/* Rating */}
            <div className="mb-6 h-4 w-32 rounded bg-gray-200" />
            
            {/* Description */}
            <div className="mb-6 space-y-3">
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-5/6 rounded bg-gray-200" />
            </div>
  
            
            {/* Buttons */}
            <div className="flex gap-4">
              <div className="h-12 flex-1 rounded-md bg-gray-200" />
              <div className="size-12 rounded-md bg-gray-200" />
            </div>
            
            {/* Details sections */}
            <div className="mt-12 space-y-4">
              <div className="h-16 w-full rounded border border-gray-200 bg-gray-100" />
              <div className="h-16 w-full rounded border border-gray-200 bg-gray-100" />
              <div className="h-16 w-full rounded border border-gray-200 bg-gray-100" />
              <div className="h-16 w-full rounded border border-gray-200 bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<ProductPageSkeleton />}>{children}</Suspense>;
}

