'use client';

import type { Product, ProductVariant } from 'lib/shopify/types';
import { useCartStore } from 'lib/stores/cart-store';
import { useProductStore } from 'lib/stores/product-store';
import type { TailwindProductDetail } from 'lib/utils';
import TailwindProductDetailComponent from './tailwind-product-detail';

interface TailwindProductWrapperProps {
  product: Product;
  transformedProduct: TailwindProductDetail;
}

export default function TailwindProductWrapper({ product, transformedProduct }: TailwindProductWrapperProps) {
  const addCartItem = useCartStore((state) => state.addCartItem);
  const openCart = useCartStore((state) => state.openCart);
  const productState = useProductStore((state) => state.state);
  
  const handleAddToCart = () => {
    const { variants } = product;
    
    // Find the selected variant based on product state
    const variant = variants.find((variant: ProductVariant) =>
      variant.selectedOptions.every(
        (option) => option.value === productState[option.name.toLowerCase()]
      )
    );
    
    // Fall back to first variant if no selection made
    const finalVariant = variant || variants[0];
    
    if (finalVariant) {
      addCartItem(finalVariant, product);
      openCart();
    }
  };

  return <TailwindProductDetailComponent product={transformedProduct} onAddToCart={handleAddToCart} />;
}

