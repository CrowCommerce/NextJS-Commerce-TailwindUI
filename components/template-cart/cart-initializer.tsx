'use client';

import { Cart } from 'lib/shopify/types';
import { useCartStore } from 'lib/stores/cart-store';
import { use, useEffect } from 'react';

export function CartInitializer({ cartPromise }: { cartPromise: Promise<Cart | undefined> }) {
  const cart = use(cartPromise);
  const setCart = useCartStore((state) => state.setCart);
  const setInitialized = useCartStore((state) => state.setInitialized);

  useEffect(() => {
    setCart(cart);
    setInitialized(true);
  }, [cart, setCart, setInitialized]);

  return null;
}

