'use client'

import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Navigation } from 'lib/shopify/types'
import { useCartStore } from 'lib/stores/cart-store'
import { useSearchStore } from 'lib/stores/search-store'
import Link from 'next/link'
import { Fragment, useState } from 'react'

export default function TailwindNavbarClient({ navigation }: { navigation: Navigation }) {
  const [open, setOpen] = useState(false)
  const { cart, openCart } = useCartStore()
  const { openSearch } = useSearchStore()

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Links */}
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium whitespace-nowrap text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category, categoryIdx) => (
                  <TabPanel key={category.name} className="space-y-12 px-4 pt-10 pb-6">
                    <div className="grid grid-cols-1 items-start gap-x-6 gap-y-10">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-10">
                        <div>
                          <p id={`mobile-featured-heading-${categoryIdx}`} className="font-medium text-gray-900">
                            Featured
                          </p>
                          <ul
                            role="list"
                            aria-labelledby={`mobile-featured-heading-${categoryIdx}`}
                            className="mt-6 space-y-6"
                          >
                            {category.featured.map((item) => (
                              <li key={item.name} className="flex">
                                <Link href={item.href} className="text-gray-500">
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p id="mobile-categories-heading" className="font-medium text-gray-900">
                            Categories
                          </p>
                          <ul role="list" aria-labelledby="mobile-categories-heading" className="mt-6 space-y-6">
                            {category.categories.map((item) => (
                              <li key={item.name} className="flex">
                                <Link href={item.href} className="text-gray-500">
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-x-6 gap-y-10">
                        <div>
                          <p id="mobile-collection-heading" className="font-medium text-gray-900">
                            Collection
                          </p>
                          <ul role="list" aria-labelledby="mobile-collection-heading" className="mt-6 space-y-6">
                            {category.collection.map((item) => (
                              <li key={item.name} className="flex">
                                <Link href={item.href} className="text-gray-500">
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p id="mobile-brand-heading" className="font-medium text-gray-900">
                            Brands
                          </p>
                          <ul role="list" aria-labelledby="mobile-brand-heading" className="mt-6 space-y-6">
                            {category.brands.map((item) => (
                              <li key={item.name} className="flex">
                                <Link href={item.href} className="text-gray-500">
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <Link href={page.href} className="-m-2 block p-2 font-medium text-gray-900">
                    {page.name}
                  </Link>
                </div>
              ))}
            </div>

          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-white">
        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center lg:hidden">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
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
              <PopoverGroup className="hidden lg:block lg:flex-1 lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category, categoryIdx) => (
                    <Popover key={category.name} className="flex">
                      <div className="relative flex">
                        <PopoverButton className="group relative flex items-center justify-center text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-indigo-600 data-open:text-indigo-600">
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
                          <div className="mx-auto max-w-7xl px-8">
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
                                        <Link href={item.href} className="hover:text-gray-800">
                                          {item.name}
                                        </Link>
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
                                        <Link href={item.href} className="hover:text-gray-800">
                                          {item.name}
                                        </Link>
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
                                        <Link href={item.href} className="hover:text-gray-800">
                                          {item.name}
                                        </Link>
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
                                        <Link href={item.href} className="hover:text-gray-800">
                                          {item.name}
                                        </Link>
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
                    <Link
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </PopoverGroup>

              {/* Logo */}
              <Link href="/" className="flex">
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

