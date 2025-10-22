import ProductGrid from "components/layout/product-grid";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/shopify";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Search",
  description: "Search for products in the store.",
  robots: { index: false },
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };

  if (!searchValue) {
    redirect("/products");
  }

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <div>
      <p className="mb-4">
        {products.length === 0
          ? "There are no products that match "
          : `Showing ${products.length} ${resultsText} for `}
        <span className="font-bold">&quot;{searchValue}&quot;</span>
      </p>
      {products.length > 0 ? <ProductGrid products={products} /> : null}
    </div>
  );
}
