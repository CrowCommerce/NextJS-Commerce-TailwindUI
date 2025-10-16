import type { Cart, CartItem, Product, ProductVariant } from 'lib/shopify/types';
import { create } from 'zustand';

type UpdateType = 'plus' | 'minus' | 'delete';

interface CartState {
  cart: Cart | undefined;
  isCartOpen: boolean;
  setCart: (cart: Cart | undefined) => void;
  openCart: () => void;
  closeCart: () => void;
  addCartItem: (variant: ProductVariant, product: Product) => void;
  updateCartItem: (merchandiseId: string, updateType: UpdateType) => void;
}

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function updateCartItemHelper(item: CartItem, updateType: UpdateType): CartItem | null {
  if (updateType === 'delete') return null;

  const newQuantity = updateType === 'plus' ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  const newTotalAmount = calculateItemCost(newQuantity, singleItemAmount.toString());

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount
      }
    }
  };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product
): CartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode
      }
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage
      }
    }
  };
}

function updateCartTotals(lines: CartItem[]): Pick<Cart, 'totalQuantity' | 'cost'> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce((sum, item) => sum + Number(item.cost.totalAmount.amount), 0);
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? 'USD';

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: '0', currencyCode }
    }
  };
}

function createEmptyCart(): Cart {
  return {
    id: undefined,
    checkoutUrl: '',
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: '0', currencyCode: 'USD' },
      totalAmount: { amount: '0', currencyCode: 'USD' },
      totalTaxAmount: { amount: '0', currencyCode: 'USD' }
    }
  };
}

export const useCartStore = create<CartState>((set) => ({
  cart: undefined,
  isCartOpen: false,
  setCart: (cart) => set({ cart }),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  addCartItem: (variant, product) =>
    set((state) => {
      const currentCart = state.cart || createEmptyCart();
      const existingItem = currentCart.lines.find((item) => item.merchandise.id === variant.id);
      const updatedItem = createOrUpdateCartItem(existingItem, variant, product);

      const updatedLines = existingItem
        ? currentCart.lines.map((item) =>
            item.merchandise.id === variant.id ? updatedItem : item
          )
        : [...currentCart.lines, updatedItem];

      return {
        cart: {
          ...currentCart,
          ...updateCartTotals(updatedLines),
          lines: updatedLines
        }
      };
    }),
  updateCartItem: (merchandiseId, updateType) =>
    set((state) => {
      const currentCart = state.cart || createEmptyCart();
      const updatedLines = currentCart.lines
        .map((item) =>
          item.merchandise.id === merchandiseId ? updateCartItemHelper(item, updateType) : item
        )
        .filter(Boolean) as CartItem[];

      if (updatedLines.length === 0) {
        return {
          cart: {
            ...currentCart,
            lines: [],
            totalQuantity: 0,
            cost: {
              ...currentCart.cost,
              totalAmount: { ...currentCart.cost.totalAmount, amount: '0' }
            }
          }
        };
      }

      return {
        cart: {
          ...currentCart,
          ...updateCartTotals(updatedLines),
          lines: updatedLines
        }
      };
    })
}));

