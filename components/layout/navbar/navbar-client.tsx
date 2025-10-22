'use client'

import { Bars3Icon } from '@heroicons/react/24/outline'
import Cart from 'components/cart'
import { SearchButton } from 'components/search-command'
import { Navigation } from 'lib/shopify/types'
import Link from 'next/link'
import { Suspense, useState } from 'react'
import NavbarDesktop from './navbar-desktop'
import NavbarMobile from './navbar-mobile'

export default function NavbarClient({ navigation }: { navigation: Navigation }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <NavbarMobile 
        navigation={navigation} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      <header className="relative bg-white">
        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center lg:hidden">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="-ml-2 rounded-md bg-white p-2 text-gray-400 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
                >
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon aria-hidden="true" className="size-6" />
                </button>

                <SearchButton className="ml-2 rounded-md p-2 text-gray-400 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2" />
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
                <SearchButton className="hidden rounded-md p-2 text-gray-400 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2 lg:block" />

              {/* Account */}
              {/* <Link href="#" className="p-2 text-gray-400 hover:text-gray-500 lg:ml-4">
                <span className="sr-only">Account</span>
                <UserIcon aria-hidden="true" className="size-6" />
              </Link> */}

              {/* Cart */}
              <div className="ml-4 flow-root lg:ml-6">
                <Suspense fallback={null}>
                  <Cart />
                </Suspense>
              </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}


