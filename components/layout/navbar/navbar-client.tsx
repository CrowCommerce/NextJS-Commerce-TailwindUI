'use client'

import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline'
import { Navigation } from 'lib/shopify/types'
import { useCartStore } from 'lib/stores/cart-store'
import { useNavbarStore } from 'lib/stores/navbar-store'
import { useSearchStore } from 'lib/stores/search-store'
import Link from 'next/link'
import NavbarDesktop from './navbar-desktop'
import NavbarInitializer from './navbar-initializer'
import NavbarMobile from './navbar-mobile'

export default function NavbarClient({ navigation }: { navigation: Navigation }) {
  const { cart, openCart } = useCartStore()
  const { openSearch } = useSearchStore()
  const openMobile = useNavbarStore((s) => s.open)

  return (
    <div className="bg-white">
      <NavbarInitializer />

      {/* Mobile menu */}
      <NavbarMobile navigation={navigation} />

      <header className="relative bg-white">
        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center lg:hidden">
                <button
                  type="button"
                  onClick={openMobile}
                  className="-ml-2 rounded-md bg-white p-2 text-gray-400 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
                >
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon aria-hidden="true" className="size-6" />
                </button>

                <button
                  onClick={openSearch}
                  type="button"
                  className="ml-2 rounded-md p-2 text-gray-400 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
                >
                  <span className="sr-only">Search</span>
                  <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Flyout menus */}
              <NavbarDesktop navigation={navigation} />

              {/* Logo */}
              <Link prefetch={true} href="/" className="flex">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                />
              </Link>

              <div className="flex flex-1 items-center justify-end">
                {/* Search */}
                <button
                  onClick={openSearch}
                  type="button"
                  className="hidden rounded-md p-2 text-gray-400 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2 lg:block"
                >
                  <span className="sr-only">Search</span>
                  <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
                </button>

                {/* Account */}
                <Link href="#" className="p-2 text-gray-400 hover:text-gray-500 lg:ml-4">
                  <span className="sr-only">Account</span>
                  <UserIcon aria-hidden="true" className="size-6" />
                </Link>

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <button onClick={openCart} className="group -m-2 flex items-center rounded-md p-2 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2">
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      {cart?.totalQuantity ?? 0}
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}


