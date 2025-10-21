'use client';

import type { Product, ProductVariant } from 'lib/shopify/types';
import { useCartStore } from 'lib/stores/cart-store';
import { useProductStore } from 'lib/stores/product-store';
import type { TailwindProductDetail } from 'lib/utils';
import ProductDetail from './product-detail';

interface ProductWrapperProps {
  product: Product;
  transformedProduct: TailwindProductDetail;
}

export default function ProductWrapper({ product, transformedProduct }: ProductWrapperProps) {
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

  return <ProductDetail product={transformedProduct} onAddToCart={handleAddToCart} />;
}

