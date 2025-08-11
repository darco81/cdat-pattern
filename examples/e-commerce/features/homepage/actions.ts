/**
 * Homepage Feature - Actions Layer
 * @layer Actions (A in CDAT)
 */

import type { Page } from '@playwright/test';
import { Cdat, LocatorState } from '../../utils/Cdat';
import { HomepageComponents } from './components';
import type { ProductCardData } from './data';

export class HomepageActions {
  private readonly components: HomepageComponents;

  constructor(private readonly page: Page) {
    this.components = new HomepageComponents(page);
  }

  // ─────────────────────────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────────────────────────

  async navigateToHome(): Promise<void> {
    await this.page.goto('/');
    await Cdat.waitForState(this.components.header, LocatorState.Visible);
  }

  async clickLogo(): Promise<void> {
    await Cdat.waitAndClick(this.components.logo);
  }

  async navigateToCategory(categoryName: string): Promise<void> {
    const link = this.components.getCategoryLink(categoryName);
    await Cdat.waitAndClick(link);
  }

  // ─────────────────────────────────────────────────────────────────
  // SEARCH
  // ─────────────────────────────────────────────────────────────────

  async search(query: string): Promise<void> {
    await Cdat.waitAndFill(this.components.searchInput, query);
    await Cdat.waitAndClick(this.components.searchButton);
  }

  async clearSearch(): Promise<void> {
    await Cdat.waitAndClear(this.components.searchInput);
  }

  // ─────────────────────────────────────────────────────────────────
  // PRODUCTS
  // ─────────────────────────────────────────────────────────────────

  async addProductToCart(index: number): Promise<void> {
    const button = this.components.addToCartButtons.nth(index);
    await Cdat.waitAndClick(button);
  }

  async getProductCount(): Promise<number> {
    await Cdat.waitForState(this.components.featuredSection, LocatorState.Visible);
    return this.components.productCards.count();
  }

  async getProductData(index: number): Promise<ProductCardData> {
    const card = this.components.getProductCard(index);
    await Cdat.waitForState(card, LocatorState.Visible);

    const name = await card.locator('[data-testid="product-name"]').textContent() ?? '';
    const priceText = await card.locator('[data-testid="product-price"]').textContent() ?? '0';
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

    return {
      name,
      price,
      inStock: true,
    };
  }

  async getAllProductNames(): Promise<string[]> {
    await Cdat.waitForMinimumCount(this.components.productNames, 1);
    return this.components.productNames.allTextContents();
  }

  // ─────────────────────────────────────────────────────────────────
  // CART
  // ─────────────────────────────────────────────────────────────────

  async getCartCount(): Promise<number> {
    const isVisible = await Cdat.checkState(
      this.components.cartCount,
      LocatorState.Visible
    );

    if (!isVisible) {
      return 0;
    }

    const text = await Cdat.waitForText(this.components.cartCount);
    return parseInt(text, 10) || 0;
  }

  async clickCart(): Promise<void> {
    await Cdat.waitAndClick(this.components.cartIcon);
  }

  // ─────────────────────────────────────────────────────────────────
  // NEWSLETTER
  // ─────────────────────────────────────────────────────────────────

  async subscribeToNewsletter(email: string): Promise<void> {
    await Cdat.waitAndFill(this.components.newsletterInput, email);
    await Cdat.waitAndClick(this.components.newsletterButton);
  }

  // ─────────────────────────────────────────────────────────────────
  // STATE CHECKS
  // ─────────────────────────────────────────────────────────────────

  async isHeroBannerVisible(): Promise<boolean> {
    return Cdat.checkState(this.components.heroBanner, LocatorState.Visible);
  }

  async getCategoryCount(): Promise<number> {
    return this.components.categoryLinks.count();
  }
}
