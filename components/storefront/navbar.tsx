'use client'

import {
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'
import { Navigation } from './types'

interface NavbarProps {
  navigation: Navigation
  onMenuOpen: () => void
}

export default function Navbar({ navigation, onMenuOpen }: NavbarProps) {
  return (
    <header className="relative z-10">
      <nav aria-label="Top">
        {/* Top navigation */}
        <div className="bg-gray-900">
          <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-medium text-white">
              Get free delivery on orders over $100
            </p>

            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
              <a href="#" className="text-sm font-medium text-white hover:text-gray-100">
                Create an account
              </a>
              <span aria-hidden="true" className="h-6 w-px bg-gray-600" />
              <a href="#" className="text-sm font-medium text-white hover:text-gray-100">
                Sign in
              </a>
            </div>
          </div>
        </div>

        {/* Secondary navigation */}
        <div className="bg-white">
          <div className="border-b border-gray-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Logo (lg+) */}
                <div className="hidden lg:flex lg:items-center">
                  <a href="#">
                    <span className="sr-only">Your Company</span>
                    <img
                      alt=""
                      src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                      className="h-8 w-auto"
                    />
                  </a>
                </div>

                <div className="hidden h-full lg:flex">
                  {/* Flyout menus */}
                  <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                    <div className="flex h-full space-x-8">
                      {navigation.categories.map((category, categoryIdx) => (
                        <Popover key={category.name} className="flex">
                          <div className="relative flex">
                            <PopoverButton className="group relative flex items-center justify-center text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-open:text-indigo-600">
                              {category.name}
                              <span
                                aria-hidden="true"
                                className="absolute inset-x-0 -bottom-px z-30 h-0.5 transition duration-200 ease-out group-data-open:bg-indigo-600"
                              />
                            </PopoverButton>
                          </div>
                          <PopoverPanel
                            transition
                            className="absolute inset-x-0 top-full z-20 w-full bg-white text-sm text-gray-500 transition data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                          >
                            {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                            <div aria-hidden="true" className="absolute inset-0 top-1/2 bg-white shadow-sm" />
                            <div className="relative bg-white">
                              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="grid grid-cols-2 items-start gap-x-8 gap-y-10 pt-10 pb-12">
                                  <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                                    <div>
                                      <p
                                        id={`desktop-featured-heading-${categoryIdx}`}
                                        className="font-medium text-gray-900"
                                      >
                                        Featured
                                      </p>
                                      <ul
                                        role="list"
                                        aria-labelledby={`desktop-featured-heading-${categoryIdx}`}
                                        className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                      >
                                        {category.featured.map((item) => (
                                          <li key={item.name} className="flex">
                                            <a href={item.href} className="hover:text-gray-800">
                                              {item.name}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <p id="desktop-categories-heading" className="font-medium text-gray-900">
                                        Categories
                                      </p>
                                      <ul
                                        role="list"
                                        aria-labelledby="desktop-categories-heading"
                                        className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                      >
                                        {category.categories.map((item) => (
                                          <li key={item.name} className="flex">
                                            <a href={item.href} className="hover:text-gray-800">
                                              {item.name}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                                    <div>
                                      <p id="desktop-collection-heading" className="font-medium text-gray-900">
                                        Collection
                                      </p>
                                      <ul
                                        role="list"
                                        aria-labelledby="desktop-collection-heading"
                                        className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                      >
                                        {category.collection.map((item) => (
                                          <li key={item.name} className="flex">
                                            <a href={item.href} className="hover:text-gray-800">
                                              {item.name}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div>
                                      <p id="desktop-brand-heading" className="font-medium text-gray-900">
                                        Brands
                                      </p>
                                      <ul
                                        role="list"
                                        aria-labelledby="desktop-brand-heading"
                                        className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                      >
                                        {category.brands.map((item) => (
                                          <li key={item.name} className="flex">
                                            <a href={item.href} className="hover:text-gray-800">
                                              {item.name}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PopoverPanel>
                        </Popover>
                      ))}
                      {navigation.pages.map((page) => (
                        <a
                          key={page.name}
                          href={page.href}
                          className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                        >
                          {page.name}
                        </a>
                      ))}
                    </div>
                  </PopoverGroup>
                </div>

                {/* Mobile menu and search (lg-) */}
                <div className="flex flex-1 items-center lg:hidden">
                  <button
                    type="button"
                    onClick={onMenuOpen}
                  className="-ml-2 rounded-md bg-white p-2 text-gray-400 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
                  >
                    <span className="sr-only">Open menu</span>
                    <Bars3Icon aria-hidden="true" className="size-6" />
                  </button>

                  {/* Search */}
                  <a href="#" className="ml-2 p-2 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
                  </a>
                </div>

                {/* Logo (lg-) */}
                <a href="#" className="lg:hidden">
                  <span className="sr-only">Your Company</span>
                  <img
                    alt=""
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    className="h-8 w-auto"
                  />
                </a>

                <div className="flex flex-1 items-center justify-end">
                  <div className="flex items-center lg:ml-8">
                    <div className="flex space-x-8">
                      <div className="hidden lg:flex">
                        <a href="#" className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                          <span className="sr-only">Search</span>
                          <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
                        </a>
                      </div>

                      <div className="flex">
                        <a href="#" className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                          <span className="sr-only">Account</span>
                          <UserIcon aria-hidden="true" className="size-6" />
                        </a>
                      </div>
                    </div>

                    <span aria-hidden="true" className="mx-4 h-6 w-px bg-gray-200 lg:mx-6" />

                    <div className="flow-root">
                      <a href="#" className="group -m-2 flex items-center p-2">
                        <ShoppingCartIcon
                          aria-hidden="true"
                          className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
                        <span className="sr-only">items in cart, view bag</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

