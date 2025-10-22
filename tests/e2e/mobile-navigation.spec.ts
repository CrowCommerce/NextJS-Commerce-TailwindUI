import { test, expect } from "@playwright/test";

test.describe("Mobile Navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("hamburger button is visible and accessible on mobile", async ({
    page,
  }) => {
    const hamburger = page.getByTestId("hamburger");
    await expect(hamburger).toBeVisible();

    // Check accessibility attributes
    await expect(hamburger).toHaveAttribute("aria-expanded", "false");
    await expect(hamburger).toHaveAttribute("aria-controls", "mobile-menu");
    await expect(hamburger).toHaveAttribute("aria-label", "Open main menu");
  });

  test("clicking hamburger opens mobile menu", async ({ page }) => {
    const hamburger = page.getByTestId("hamburger");
    await hamburger.click();

    // Menu should be visible
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu).toBeVisible();

    // Button aria-expanded should be true
    await expect(hamburger).toHaveAttribute("aria-expanded", "true");
  });

  test("mobile menu contains navigation links", async ({ page }) => {
    const hamburger = page.getByTestId("hamburger");
    await hamburger.click();

    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu).toBeVisible();

    // Check for category tabs (Women, Men)
    await expect(mobileMenu.getByText("Women")).toBeVisible();
    await expect(mobileMenu.getByText("Men")).toBeVisible();
  });

  test("clicking close button closes mobile menu", async ({ page }) => {
    const hamburger = page.getByTestId("hamburger");
    await hamburger.click();

    // Menu should be open
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu).toBeVisible();

    // Click close button
    const closeButton = page.getByTestId("close-mobile-menu");
    await closeButton.click();

    // Menu should be closed
    await expect(mobileMenu).not.toBeVisible();
    await expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });

  test("pressing ESC key closes mobile menu", async ({ page }) => {
    const hamburger = page.getByTestId("hamburger");
    await hamburger.click();

    // Menu should be open
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu).toBeVisible();

    // Press ESC
    await page.keyboard.press("Escape");

    // Menu should be closed
    await expect(mobileMenu).not.toBeVisible();
    await expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });

  test("clicking outside menu closes it", async ({ page }) => {
    const hamburger = page.getByTestId("hamburger");
    await hamburger.click();

    // Menu should be open
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu).toBeVisible();

    // Click backdrop (outside menu)
    await page
      .locator(".fixed.inset-0.bg-black\\/25")
      .click({ position: { x: 350, y: 400 } });

    // Menu should be closed
    await expect(mobileMenu).not.toBeVisible();
  });

  test("menu links are clickable", async ({ page }) => {
    const hamburger = page.getByTestId("hamburger");
    await hamburger.click();

    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu).toBeVisible();

    // Switch to Men tab and click a link
    await page.getByRole("tab", { name: "Men" }).click();

    // Find and click a link
    const casualLink = page.getByRole("link", { name: "Casual" }).first();
    await expect(casualLink).toBeVisible();

    // Click should navigate (menu auto-closes on navigation)
    await casualLink.click();

    // Wait for navigation
    await page.waitForURL(/\/products/, { timeout: 5000 });
  });

  test("focus is returned to hamburger button when menu closes", async ({
    page,
  }) => {
    const hamburger = page.getByTestId("hamburger");
    await hamburger.click();

    // Close menu
    const closeButton = page.getByTestId("close-mobile-menu");
    await closeButton.click();

    // Wait a bit for focus return
    await page.waitForTimeout(150);

    // Hamburger should be focused
    await expect(hamburger).toBeFocused();
  });

  test("body scroll is locked when menu is open", async ({ page }) => {
    const hamburger = page.getByTestId("hamburger");

    // Initially no scroll lock
    let bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe("");

    // Open menu
    await hamburger.click();

    // Body should have overflow hidden
    bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe("hidden");

    // Close menu
    const closeButton = page.getByTestId("close-mobile-menu");
    await closeButton.click();

    // Body scroll should be restored
    bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe("");
  });

  test("menu auto-closes when window is resized to desktop", async ({
    page,
  }) => {
    const hamburger = page.getByTestId("hamburger");
    await hamburger.click();

    // Menu should be open
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu).toBeVisible();

    // Resize to desktop
    await page.setViewportSize({ width: 1280, height: 800 });

    // Menu should close
    await expect(mobileMenu).not.toBeVisible();
  });

  test("hamburger button is not visible on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const hamburger = page.getByTestId("hamburger");
    await expect(hamburger).not.toBeVisible();
  });
});
