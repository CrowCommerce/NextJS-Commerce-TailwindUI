'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import CartPrice from 'components/price/cart-price'
import { createCartAndSetCookie, redirectToCheckout, removeItem } from 'components/template-cart/actions'
import { EditItemQuantityButton } from 'components/template-cart/edit-item-quantity-button'
import LoadingDots from 'components/template-loading-dots'
import { DEFAULT_OPTION } from 'lib/constants'
import type { CartItem } from 'lib/shopify/types'
import { useCartStore } from 'lib/stores/cart-store'
import { createUrl } from 'lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'

export default function TailwindCart() {
  const { cart, isCartOpen, closeCart, updateCartItem } = useCartStore()
  const quantityRef = useRef(cart?.totalQuantity)
  const hasInitialized = useRef(false)

  // Only create cart if truly needed (no cookie exists) - run once on mount
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true
      // Only create a cart if we don't have one after initialization completes
      const timer = setTimeout(() => {
        if (!cart) {
          createCartAndSetCookie()
        }
      }, 100) // Small delay to allow cart initialization to complete
      return () => clearTimeout(timer)
    }
  }, [])

  // Auto-open cart when quantity increases (not on initial hydration)
  useEffect(() => {
    // Skip the initial hydration by checking if quantityRef was already set
    if (quantityRef.current !== undefined && cart?.totalQuantity && cart.totalQuantity > quantityRef.current) {
      if (!isCartOpen) {
        useCartStore.getState().openCart()
      }
    }
    quantityRef.current = cart?.totalQuantity
  }, [isCartOpen, cart?.totalQuantity])

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
                          className="relative -m-2 rounded-md p-2 text-gray-400 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
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
                            {cart.lines
                              .sort((a, b) =>
                                a.merchandise.product.title.localeCompare(
                                  b.merchandise.product.title
                                )
                              )
                              .map((item) => {
                                const merchandiseSearchParams: Record<string, string> = {}
                                item.merchandise.selectedOptions.forEach(({ name, value }) => {
                                  if (value !== DEFAULT_OPTION) {
                                    merchandiseSearchParams[name.toLowerCase()] = value
                                  }
                                })
                                const merchandiseUrl = createUrl(
                                  `/product/${item.merchandise.product.handle}`,
                                  new URLSearchParams(merchandiseSearchParams)
                                )

                                return (
                                  <li key={item.id || item.merchandise.id} className="flex py-6">
                                    <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <Image
                                        alt={item.merchandise.product.featuredImage.altText || item.merchandise.product.title}
                                        src={item.merchandise.product.featuredImage.url}
                                        width={96}
                                        height={96}
                                        className="size-full object-cover"
                                      />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3>
                                            <Link href={merchandiseUrl}>
                                              {item.merchandise.product.title}
                                            </Link>
                                          </h3>
                                          <CartPrice
                                            className="ml-4"
                                            amount={item.cost.totalAmount.amount}
                                            currencyCode={item.cost.totalAmount.currencyCode}
                                          />
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
                                          <RemoveItemTextButton item={item} optimisticUpdate={updateCartItem} />
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                )
                              })}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <div className="text-right">
                        {cart && cart.cost.totalAmount.amount !== '0' ? (
                          <CartPrice
                            amount={cart.cost.totalAmount.amount}
                            currencyCode={cart.cost.totalAmount.currencyCode}
                          />
                        ) : (
                          <span>$0.00</span>
                        )}
                      </div>
                    </div>
                    {/*
                    <div className="py-4 text-sm text-neutral-500">
                      <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1">
                        <p>Taxes</p>
                        <CartPrice
                          className="text-right text-base text-black"
                          amount={cart?.cost.totalTaxAmount.amount || '0'}
                          currencyCode={cart?.cost.totalTaxAmount.currencyCode || cart?.cost.totalAmount.currencyCode || 'USD'}
                        />
                      </div>
                      <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1">
                        <p>Shipping</p>
                        <p className="text-right">Calculated at checkout</p>
                      </div>
                      <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1">
                        <p>Total</p>
                        <CartPrice
                          className="text-right text-base text-black"
                          amount={cart?.cost.totalAmount.amount || '0'}
                          currencyCode={cart?.cost.totalAmount.currencyCode || 'USD'}
                        />
                      </div>
                    </div>
                    */}
                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                      <form action={redirectToCheckout}>
                        <CheckoutButton />
                      </form>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                      <p>
                        or{' '}
                        <button
                          type="button"
                          onClick={closeCart}
                          className="rounded font-medium text-indigo-600 hover:text-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
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

function RemoveItemTextButton({ item, optimisticUpdate }: { item: CartItem; optimisticUpdate: any }) {
  const [message, formAction] = useActionState(removeItem, null)
  const merchandiseId = item.merchandise.id
  const removeItemAction = formAction.bind(null, merchandiseId)

  return (
    <form
      action={async () => {
        optimisticUpdate(merchandiseId, 'delete')
        removeItemAction()
      }}
    >
      <button
        type="submit"
        className="rounded font-medium text-indigo-600 hover:text-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
      >
        Remove
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  )
}

function CheckoutButton() {
  const { pending } = useFormStatus()

  return (
    <button
      className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus:outline-hidden"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingDots className="bg-white" /> : 'Checkout'}
    </button>
  )
}
