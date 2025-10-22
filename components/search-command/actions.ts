"use server";

import { getProducts } from "lib/shopify";
import { Product } from "lib/shopify/types";

export async function searchProducts(
  query: string,
): Promise<{ results: Product[]; totalCount: number }> {
  try {
    const products = await getProducts({
      query,
      sortKey: "RELEVANCE",
      reverse: false,
    });
    return {
      results: products.slice(0, 8), // Limit to 8 results in modal
      totalCount: products.length,
    };
  } catch (error) {
    console.error("Search error:", error);
    return { results: [], totalCount: 0 };
  }
}
