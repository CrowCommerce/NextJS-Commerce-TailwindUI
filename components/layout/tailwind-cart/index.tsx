'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { EditItemQuantityButton } from 'components/template-cart/edit-item-quantity-button'
import Price from 'components/template-price'
import { useCartStore } from 'lib/stores/cart-store'
import Link from 'next/link'

export default function TailwindCart() {
  const { cart, isCartOpen, closeCart, updateCartItem } = useCartStore()

  return (
    <>
      <Dialog open={isCartOpen} onClose={closeCart} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-lg font-medium text-gray-900">Shopping cart</DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={closeCart}
                          className="relative -m-2 rounded-md p-2 text-gray-400 hover:text-gray-500 focus:outline-2 focus:outline-indigo-600 focus:outline-offset-2"
                        >
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flow-root">
                        {!cart || cart.lines.length === 0 ? (
                          <div className="text-center py-12">
                            <p className="text-gray-500">Your cart is empty</p>
                          </div>
                        ) : (
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {cart.lines.map((item) => (
                              <li key={item.id || item.merchandise.id} className="flex py-6">
                                <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    alt={item.merchandise.product.featuredImage.altText}
                                    src={item.merchandise.product.featuredImage.url}
                                    className="size-full object-cover"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <Link href={`/product/${item.merchandise.product.handle}`}>
                                          {item.merchandise.product.title}
                                        </Link>
                                      </h3>
                                      <p className="ml-4">
                                        <Price
                                          amount={item.cost.totalAmount.amount}
                                          currencyCode={item.cost.totalAmount.currencyCode}
                                        />
                                      </p>
                                    </div>
                                    {item.merchandise.title !== 'Default Title' && (
                                      <p className="mt-1 text-sm text-gray-500">{item.merchandise.title}</p>
                                    )}
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="ml-0 flex h-7 flex-row items-center rounded-full border border-gray-200 bg-white">
                                      <EditItemQuantityButton item={item} type="minus" optimisticUpdate={updateCartItem} size="xs" />
                                      <span className="relative z-10 mx-1 w-8 px-0.5 text-center text-sm font-semibold leading-none text-indigo-500 tabular-nums select-none">{item.quantity}</span>
                                      <EditItemQuantityButton item={item} type="plus" optimisticUpdate={updateCartItem} size="xs" />
                                    </div>

                                    <div className="flex">
                                      <button
                                        type="button"
                                        onClick={() => updateCartItem(item.merchandise.id, 'delete')}
                                        className="rounded font-medium text-indigo-600 hover:text-indigo-500 focus:outline-2 focus:outline-indigo-600 focus:outline-offset-2"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>
                        {cart && cart.cost.totalAmount.amount !== '0' ? (
                          <Price
                            amount={cart.cost.totalAmount.amount}
                            currencyCode={cart.cost.totalAmount.currencyCode}
                          />
                        ) : (
                          '$0.00'
                        )}
                      </p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                      <a
                        href={cart?.checkoutUrl || '#'}
                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                      >
                        Checkout
                      </a>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                      <p>
                        or{' '}
                        <button
                          type="button"
                          onClick={closeCart}
                          className="rounded font-medium text-indigo-600 hover:text-indigo-500 focus:outline-2 focus:outline-indigo-600 focus:outline-offset-2"
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}
