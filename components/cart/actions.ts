'use server';

import { TAGS } from 'lib/constants';
import {
    addToCart,
    createCart,
    getCart,
    removeFromCart,
    updateCart
} from 'lib/shopify';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined
) {
  if (!selectedVariantId) {
    return 'Error adding item to cart';
  }

  try {
    // Ensure a cart exists before adding
    const cartId = (await cookies()).get('cartId')?.value
    if (!cartId) {
      const newCart = await createCart();
      (await cookies()).set('cartId', newCart.id!);
    }

    const updatedCart = await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    revalidateTag(TAGS.cart, "max");
    return updatedCart;
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      const updatedCart = await removeFromCart([lineItem.id]);
      revalidateTag(TAGS.cart, "max");
      return updatedCart;
    } else {
      return 'Item not found in cart';
    }
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    let updatedCart;
    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        updatedCart = await removeFromCart([lineItem.id]);
      } else {
        updatedCart = await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity
          }
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      updatedCart = await addToCart([{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart, "max");
    return updatedCart;
  } catch (e) {
    console.error(e);
    return 'Error updating item quantity';
  }
}

export async function redirectToCheckout() {
  let cart = await getCart();
  redirect(cart!.checkoutUrl);
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set('cartId', cart.id!);
}

export async function loadCart(prevState: any) {
  const cart = await getCart();
  return cart ?? null;
}
