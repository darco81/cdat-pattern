/**
 * Homepage Feature - Components Layer
 * @layer Components (C in CDAT)
 */

import type { Page, Locator } from '@playwright/test';

export class HomepageComponents {
  // Navigation
  readonly header: Locator;
  readonly logo: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly cartIcon: Locator;
  readonly cartCount: Locator;
  readonly userMenu: Locator;

  // Categories
  readonly categoryNav: Locator;
  readonly categoryLinks: Locator;

  // Featured products
  readonly featuredSection: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly addToCartButtons: Locator;

  // Promotional banners
  readonly heroBanner: Locator;
  readonly promotionBanners: Locator;

  // Footer
  readonly footer: Locator;
  readonly newsletterInput: Locator;
  readonly newsletterButton: Locator;

  constructor(private readonly page: Page) {
    // Navigation
    this.header = page.locator('header');
    this.logo = page.locator('[data-testid="logo"]');
    this.searchInput = page.getByRole('searchbox');
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.cartIcon = page.locator('[data-testid="cart-icon"]');
    this.cartCount = page.locator('[data-testid="cart-count"]');
    this.userMenu = page.locator('[data-testid="user-menu"]');

    // Categories
    this.categoryNav = page.locator('[data-testid="category-nav"]');
    this.categoryLinks = this.categoryNav.getByRole('link');

    // Featured products
    this.featuredSection = page.locator('[data-testid="featured-products"]');
    this.productCards = page.locator('[data-testid="product-card"]');
    this.productNames = this.productCards.locator('[data-testid="product-name"]');
    this.productPrices = this.productCards.locator('[data-testid="product-price"]');
    this.addToCartButtons = this.productCards.getByRole('button', { name: /add to cart/i });

    // Promotional banners
    this.heroBanner = page.locator('[data-testid="hero-banner"]');
    this.promotionBanners = page.locator('[data-testid="promo-banner"]');

    // Footer
    this.footer = page.locator('footer');
    this.newsletterInput = page.getByPlaceholder(/email/i);
    this.newsletterButton = page.getByRole('button', { name: /subscribe/i });
  }

  /**
   * Get a specific product card by index
   */
  getProductCard(index: number): Locator {
    return this.productCards.nth(index);
  }

  /**
   * Get a specific category link by name
   */
  getCategoryLink(name: string): Locator {
    return this.categoryNav.getByRole('link', { name: new RegExp(name, 'i') });
  }
}
