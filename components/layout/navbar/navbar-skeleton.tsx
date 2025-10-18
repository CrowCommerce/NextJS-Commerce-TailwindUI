export default function NavbarSkeleton() {
  return (
    <div className="bg-white">
      <header className="relative bg-white">
        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center justify-between">
              {/* Mobile menu button skeleton */}
              <div className="flex flex-1 items-center lg:hidden">
                <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200" />
                <div className="ml-2 h-10 w-10 animate-pulse rounded-md bg-gray-200" />
              </div>

              {/* Desktop menu skeleton */}
              <div className="hidden lg:flex lg:flex-1 lg:space-x-8">
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-14 animate-pulse rounded bg-gray-200" />
              </div>

              {/* Logo skeleton */}
              <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />

              {/* Right icons skeleton */}
              <div className="flex flex-1 items-center justify-end space-x-4">
                <div className="hidden h-6 w-6 animate-pulse rounded bg-gray-200 lg:block" />
                <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}


