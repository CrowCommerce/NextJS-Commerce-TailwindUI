"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import Cart from "components/cart";
import { SearchButton } from "components/search-command";
import { Navigation } from "lib/shopify/types";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import NavbarDesktop from "./navbar-desktop";
import NavbarMobile from "./navbar-mobile";

export default function NavbarClient({
  navigation,
}: {
  navigation: Navigation;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const touchedRef = useRef(false);

  // Debug: Verify component mounting and button ref
  useEffect(() => {
    console.log("[NavbarClient] Component mounted");
    console.log("[NavbarClient] Button element:", hamburgerButtonRef.current);
    console.log("[NavbarClient] Button in DOM:", !!hamburgerButtonRef.current);
    console.log("[NavbarClient] Window width:", window.innerWidth);
  }, []);

  // Debug: Log menu state changes
  useEffect(() => {
    console.log("[NavbarClient] Menu state changed:", isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Handle mobile menu close and return focus to hamburger button
  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
    // Return focus to hamburger button after menu closes
    setTimeout(() => {
      hamburgerButtonRef.current?.focus();
    }, 100);
  };

  // Unified handler to open menu
  const handleOpen = () => {
    console.log("[NavbarClient] Opening menu");
    setIsMobileMenuOpen(true);
  };

  // Touch event handler - marks touch as handled
  const handleTouchStart = () => {
    console.log("[NavbarClient] Touch event detected");
    touchedRef.current = true;
    handleOpen();
    // Clear flag after 500ms to allow future clicks
    setTimeout(() => {
      touchedRef.current = false;
    }, 500);
  };

  // Click event handler - ignores clicks immediately after touch
  const handleClick = () => {
    console.log(
      "[NavbarClient] Click event detected, touched:",
      touchedRef.current,
    );
    // If touch fired recently, ignore this click (prevents double-firing)
    if (touchedRef.current) {
      console.log("[NavbarClient] Ignoring duplicate click after touch");
      return;
    }
    handleOpen();
  };

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <NavbarMobile
        navigation={navigation}
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMobileMenu}
      />

      <header className="relative bg-white">
        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center justify-between">
              <div className="relative z-50 flex flex-1 items-center lg:hidden">
                <button
                  ref={hamburgerButtonRef}
                  type="button"
                  onClick={handleClick}
                  onTouchStart={handleTouchStart}
                  className="relative z-10 -ml-2 min-h-[44px] min-w-[44px] touch-manipulation cursor-pointer rounded-md bg-white p-2 text-gray-400 active:bg-gray-100 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu"
                  aria-label="Open main menu"
                  data-testid="hamburger"
                  style={{
                    WebkitTapHighlightColor: "transparent",
                    touchAction: "manipulation",
                  }}
                >
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon aria-hidden="true" className="size-6" />
                </button>

                <SearchButton className="ml-2 rounded-md p-2 text-gray-400 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2" />
              </div>

              {/* Flyout menus */}
              <NavbarDesktop navigation={navigation} />

              {/* Logo */}
              <Link prefetch={true} href="/" className="flex">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                />
              </Link>

              <div className="flex flex-1 items-center justify-end">
                {/* Search */}
                <SearchButton className="hidden rounded-md p-2 text-gray-400 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2 lg:block" />

                {/* Account */}
                {/* <Link href="#" className="p-2 text-gray-400 hover:text-gray-500 lg:ml-4">
                <span className="sr-only">Account</span>
                <UserIcon aria-hidden="true" className="size-6" />
              </Link> */}

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <Suspense fallback={null}>
                    <Cart />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
