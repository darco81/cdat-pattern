/**
 * Product Feature - Components Layer
 * @layer Components (C in CDAT)
 */

import type { Page, Locator } from '@playwright/test';

export class ProductComponents {
  // Product info
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly originalPrice: Locator;
  readonly discountBadge: Locator;
  readonly productDescription: Locator;
  readonly productSku: Locator;
  readonly stockStatus: Locator;

  // Images
  readonly mainImage: Locator;
  readonly thumbnails: Locator;

  // Variants
  readonly sizeSelector: Locator;
  readonly sizeOptions: Locator;
  readonly colorSelector: Locator;
  readonly colorOptions: Locator;

  // Quantity & Cart
  readonly quantityInput: Locator;
  readonly quantityIncrease: Locator;
  readonly quantityDecrease: Locator;
  readonly addToCartButton: Locator;
  readonly buyNowButton: Locator;

  // Reviews
  readonly reviewsSection: Locator;
  readonly averageRating: Locator;
  readonly reviewCount: Locator;
  readonly reviewItems: Locator;

  // Related products
  readonly relatedProducts: Locator;

  constructor(private readonly page: Page) {
    // Product info
    this.productTitle = page.locator('[data-testid="product-title"]');
    this.productPrice = page.locator('[data-testid="product-price"]');
    this.originalPrice = page.locator('[data-testid="original-price"]');
    this.discountBadge = page.locator('[data-testid="discount-badge"]');
    this.productDescription = page.locator('[data-testid="product-description"]');
    this.productSku = page.locator('[data-testid="product-sku"]');
    this.stockStatus = page.locator('[data-testid="stock-status"]');

    // Images
    this.mainImage = page.locator('[data-testid="main-image"]');
    this.thumbnails = page.locator('[data-testid="thumbnail"]');

    // Variants
    this.sizeSelector = page.locator('[data-testid="size-selector"]');
    this.sizeOptions = this.sizeSelector.getByRole('button');
    this.colorSelector = page.locator('[data-testid="color-selector"]');
    this.colorOptions = this.colorSelector.getByRole('button');

    // Quantity & Cart
    this.quantityInput = page.locator('[data-testid="quantity-input"]');
    this.quantityIncrease = page.locator('[data-testid="quantity-increase"]');
    this.quantityDecrease = page.locator('[data-testid="quantity-decrease"]');
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.buyNowButton = page.getByRole('button', { name: /buy now/i });

    // Reviews
    this.reviewsSection = page.locator('[data-testid="reviews-section"]');
    this.averageRating = page.locator('[data-testid="average-rating"]');
    this.reviewCount = page.locator('[data-testid="review-count"]');
    this.reviewItems = page.locator('[data-testid="review-item"]');

    // Related products
    this.relatedProducts = page.locator('[data-testid="related-products"]');
  }

  getSizeOption(size: string): Locator {
    return this.sizeSelector.getByRole('button', { name: size });
  }

  getColorOption(color: string): Locator {
    return this.colorSelector.getByRole('button', { name: new RegExp(color, 'i') });
  }
}
