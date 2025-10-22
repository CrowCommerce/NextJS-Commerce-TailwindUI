"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import {
  Fragment,
  ReactNode,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ProductResult } from "./product-result";
import { useSearch } from "./use-search";

const SearchContext = createContext<{
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
} | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Cmd+K handler
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        openSearch: () => setIsOpen(true),
        closeSearch: () => setIsOpen(false),
        toggleSearch: () => setIsOpen((prev) => !prev),
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function SearchButton({ className }: { className?: string }) {
  const context = useContext(SearchContext);
  if (!context) throw new Error("SearchButton must be within SearchProvider");

  return (
    <button onClick={context.openSearch} type="button" className={className}>
      <span className="sr-only">Search</span>
      <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
    </button>
  );
}

// SeeAllResultsOption component
const SeeAllResultsOption = forwardRef<
  HTMLDivElement,
  {
    query: string;
    totalCount: number;
    active: boolean;
  } & React.HTMLAttributes<HTMLDivElement>
>(({ query, totalCount, active, ...props }, ref) => {
  const itemRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active item into view
  useEffect(() => {
    if (active && itemRef.current) {
      itemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [active]);

  const setRef = (node: HTMLDivElement | null) => {
    itemRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      (ref as any).current = node;
    }
  };

  return (
    <div
      ref={setRef}
      {...props}
      className={`flex cursor-pointer select-none items-center rounded-lg px-3 py-2 ${
        active
          ? "bg-indigo-600 text-white"
          : "bg-gray-50 text-gray-900 hover:bg-gray-100"
      }`}
    >
      <MagnifyingGlassIcon
        className={`h-5 w-5 ${active ? "text-white" : "text-gray-400"}`}
      />
      <div className="ml-3 flex-auto">
        <p
          className={`text-sm font-medium ${active ? "text-white" : "text-gray-900"}`}
        >
          See all {totalCount} products matching &quot;{query}&quot;
        </p>
      </div>
      {active && (
        <svg
          className="h-5 w-5 flex-none text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
});

SeeAllResultsOption.displayName = "SeeAllResultsOption";

export function SearchDialog() {
  const context = useContext(SearchContext);
  if (!context) throw new Error("SearchDialog must be within SearchProvider");

  const { isOpen, closeSearch } = context;
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { results, totalCount, loading } = useSearch(query, isOpen);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  const handleSelect = (value: string | null) => {
    // Headless UI Combobox can emit null when the input is cleared
    if (!value) return;
    if (value.startsWith("search:")) {
      const searchQuery = value.replace("search:", "");
      closeSearch();
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      closeSearch();
      router.push(`/product/${value}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      closeSearch();
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <Dialog open={isOpen} onClose={closeSearch} className="relative z-50">
      {/* Backdrop */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      {/* Modal positioning */}
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
        <DialogPanel
          transition
          className="mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl outline-1 outline-black/5 transition-all data-closed:scale-95 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        >
          <Combobox onChange={handleSelect}>
            {/* Search input */}
            <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <ComboboxInput
                autoFocus
                className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm outline-hidden"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !results.length) {
                    handleSubmit(e);
                  }
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-3.5 rounded text-gray-400 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
                  type="button"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Results */}
            {query && (
              <ComboboxOptions
                static
                className="max-h-96 scroll-py-3 overflow-y-auto p-3"
              >
                {loading ? (
                  <div className="px-4 py-14 text-center text-sm text-gray-500">
                    Searching...
                  </div>
                ) : results.length === 0 ? (
                  <div className="px-4 py-14 text-center text-sm text-gray-500">
                    No products found. Press Enter to see all search results.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* "See all" option first */}
                    <ComboboxOption
                      key="see-all"
                      value={`search:${query}`}
                      as={Fragment}
                    >
                      {({ active }) => (
                        <SeeAllResultsOption
                          query={query}
                          totalCount={totalCount}
                          active={active}
                        />
                      )}
                    </ComboboxOption>

                    {/* Individual product results */}
                    {results.map((product) => (
                      <ComboboxOption
                        key={product.id}
                        value={product.handle}
                        as={Fragment}
                      >
                        {({ active }) => (
                          <ProductResult product={product} active={active} />
                        )}
                      </ComboboxOption>
                    ))}
                  </div>
                )}
              </ComboboxOptions>
            )}

            {/* Footer hint */}
            {query && results.length > 0 && (
              <div className="flex flex-wrap items-center bg-gray-50 px-4 py-2.5 text-xs text-gray-700">
                <kbd className="mx-1 flex h-5 w-5 items-center justify-center rounded border border-indigo-300 bg-indigo-50 font-semibold text-indigo-700 sm:mx-2">
                  ↵
                </kbd>
                <span className="sm:hidden">to select</span>
                <span className="hidden sm:inline">Press Enter to select</span>
              </div>
            )}
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
