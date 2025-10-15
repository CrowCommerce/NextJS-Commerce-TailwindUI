'use client';

import { useProductStore } from 'lib/stores/product-store';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function ProductInitializer() {
  const searchParams = useSearchParams();
  const setOptions = useProductStore((state) => state.setOptions);
  const resetOptions = useProductStore((state) => state.resetOptions);

  useEffect(() => {
    const params: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    setOptions(params);

    // Reset options when component unmounts (navigating away from product page)
    return () => {
      resetOptions();
    };
  }, [searchParams, setOptions, resetOptions]);

  return null;
}

