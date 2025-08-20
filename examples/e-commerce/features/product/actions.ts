/**
 * Product Feature - Actions Layer
 * @layer Actions (A in CDAT)
 */

import type { Page } from '@playwright/test';
import { Cdat, LocatorState } from '../../utils/Cdat';
import { ProductComponents } from './components';
import type { ProductSelection, Product } from './data';

export class ProductActions {
  private readonly components: ProductComponents;

  constructor(private readonly page: Page) {
    this.components = new ProductComponents(page);
  }

  // ─────────────────────────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────────────────────────

  async navigateToProduct(productId: string): Promise<void> {
    await this.page.goto(`/product/${productId}`);
    await Cdat.waitForState(this.components.productTitle, LocatorState.Visible);
  }

  // ─────────────────────────────────────────────────────────────────
  // VARIANT SELECTION
  // ─────────────────────────────────────────────────────────────────

  async selectSize(size: string): Promise<void> {
    const option = this.components.getSizeOption(size);
    await Cdat.waitAndClick(option);
  }

  async selectColor(color: string): Promise<void> {
    const option = this.components.getColorOption(color);
    await Cdat.waitAndClick(option);
  }

  async selectVariants(selection: ProductSelection): Promise<void> {
    if (selection.size) {
      await this.selectSize(selection.size);
    }
    if (selection.color) {
      await this.selectColor(selection.color);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // QUANTITY
  // ─────────────────────────────────────────────────────────────────

  async setQuantity(quantity: number): Promise<void> {
    await Cdat.waitAndClear(this.components.quantityInput);
    await Cdat.waitAndFill(this.components.quantityInput, quantity.toString());
  }

  async increaseQuantity(): Promise<void> {
    await Cdat.waitAndClick(this.components.quantityIncrease);
  }

  async decreaseQuantity(): Promise<void> {
    await Cdat.waitAndClick(this.components.quantityDecrease);
  }

  async getQuantity(): Promise<number> {
    const value = await Cdat.waitForInputValue(this.components.quantityInput);
    return parseInt(value, 10);
  }

  // ─────────────────────────────────────────────────────────────────
  // ADD TO CART
  // ─────────────────────────────────────────────────────────────────

  async addToCart(): Promise<void> {
    await Cdat.waitAndClick(this.components.addToCartButton);
  }

  async addToCartWithSelection(selection: ProductSelection): Promise<void> {
    await this.selectVariants(selection);
    await this.setQuantity(selection.quantity);
    await this.addToCart();
  }

  async buyNow(): Promise<void> {
    await Cdat.waitAndClick(this.components.buyNowButton);
  }

  // ─────────────────────────────────────────────────────────────────
  // PRODUCT INFO
  // ─────────────────────────────────────────────────────────────────

  async getProductTitle(): Promise<string> {
    return Cdat.waitForText(this.components.productTitle);
  }

  async getProductPrice(): Promise<number> {
    const text = await Cdat.waitForText(this.components.productPrice);
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async isInStock(): Promise<boolean> {
    const text = await Cdat.waitForText(this.components.stockStatus);
    return text.toLowerCase().includes('in stock');
  }

  async isAddToCartEnabled(): Promise<boolean> {
    return this.components.addToCartButton.isEnabled();
  }

  // ─────────────────────────────────────────────────────────────────
  // IMAGES
  // ─────────────────────────────────────────────────────────────────

  async clickThumbnail(index: number): Promise<void> {
    await Cdat.waitAndClick(this.components.thumbnails.nth(index));
  }

  async getThumbnailCount(): Promise<number> {
    return this.components.thumbnails.count();
  }
}
