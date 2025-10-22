import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NavbarClient from "../navbar-client";
import { Navigation } from "lib/shopify/types";

// Mock child components
vi.mock("../navbar-desktop", () => ({
  default: () => <div data-testid="navbar-desktop">Desktop Nav</div>,
}));

vi.mock("../navbar-mobile", () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    <div data-testid="navbar-mobile" role="dialog" aria-hidden={!isOpen}>
      <button onClick={onClose} data-testid="close-mobile-menu">
        Close
      </button>
    </div>
  ),
}));

vi.mock("components/cart", () => ({
  default: () => <div data-testid="cart">Cart</div>,
}));

vi.mock("components/search-command", () => ({
  SearchButton: ({ className }: { className?: string }) => (
    <button className={className} data-testid="search-button">
      Search
    </button>
  ),
}));

const mockNavigation: Navigation = {
  categories: [
    {
      name: "Women",
      featured: [{ name: "Sleep", href: "/products" }],
      categories: [{ name: "Basic Tees", href: "/products" }],
      collection: [{ name: "Everything", href: "/products" }],
      brands: [{ name: "Full Nelson", href: "/products" }],
    },
  ],
  pages: [{ name: "Company", href: "/search" }],
};

describe("NavbarClient", () => {
  it("renders the hamburger menu button", () => {
    render(<NavbarClient navigation={mockNavigation} />);
    const hamburger = screen.getByTestId("hamburger");
    expect(hamburger).toBeInTheDocument();
  });

  it("has proper accessibility attributes on hamburger button", () => {
    render(<NavbarClient navigation={mockNavigation} />);
    const hamburger = screen.getByTestId("hamburger");

    expect(hamburger).toHaveAttribute("aria-expanded", "false");
    expect(hamburger).toHaveAttribute("aria-controls", "mobile-menu");
    expect(hamburger).toHaveAttribute("aria-label", "Open main menu");
    expect(hamburger).toHaveAttribute("type", "button");
  });

  it("opens mobile menu when hamburger is clicked", async () => {
    render(<NavbarClient navigation={mockNavigation} />);
    const hamburger = screen.getByTestId("hamburger");

    // Initially closed
    expect(hamburger).toHaveAttribute("aria-expanded", "false");

    // Click to open
    fireEvent.click(hamburger);

    // Wait for state update
    await waitFor(() => {
      expect(hamburger).toHaveAttribute("aria-expanded", "true");
    });
  });

  it("locks body scroll when menu is open", async () => {
    render(<NavbarClient navigation={mockNavigation} />);
    const hamburger = screen.getByTestId("hamburger");

    // Initially no lock
    expect(document.body.style.overflow).toBe("");

    // Click to open
    fireEvent.click(hamburger);

    // Wait for effect
    await waitFor(() => {
      expect(document.body.style.overflow).toBe("hidden");
    });
  });

  it("unlocks body scroll when menu is closed", async () => {
    render(<NavbarClient navigation={mockNavigation} />);
    const hamburger = screen.getByTestId("hamburger");

    // Open menu
    fireEvent.click(hamburger);
    await waitFor(() => {
      expect(document.body.style.overflow).toBe("hidden");
    });

    // Close menu
    const closeButton = screen.getByTestId("close-mobile-menu");
    fireEvent.click(closeButton);

    // Wait for state update
    await waitFor(() => {
      expect(document.body.style.overflow).toBe("");
    });
  });

  it("closes menu and returns focus to hamburger button", async () => {
    render(<NavbarClient navigation={mockNavigation} />);
    const hamburger = screen.getByTestId("hamburger");

    // Open menu
    fireEvent.click(hamburger);
    await waitFor(() => {
      expect(hamburger).toHaveAttribute("aria-expanded", "true");
    });

    // Close menu
    const closeButton = screen.getByTestId("close-mobile-menu");
    fireEvent.click(closeButton);

    // Wait for state update and focus return
    await waitFor(
      () => {
        expect(hamburger).toHaveAttribute("aria-expanded", "false");
      },
      { timeout: 200 },
    );
  });

  it("renders desktop and mobile navigation components", () => {
    render(<NavbarClient navigation={mockNavigation} />);

    expect(screen.getByTestId("navbar-desktop")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-mobile")).toBeInTheDocument();
  });

  it("renders cart component", () => {
    render(<NavbarClient navigation={mockNavigation} />);
    expect(screen.getByTestId("cart")).toBeInTheDocument();
  });

  it("renders search buttons", () => {
    render(<NavbarClient navigation={mockNavigation} />);
    const searchButtons = screen.getAllByTestId("search-button");
    expect(searchButtons.length).toBeGreaterThanOrEqual(1);
  });
});
