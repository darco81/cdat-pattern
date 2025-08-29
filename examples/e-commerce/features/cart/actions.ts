/**
 * Cart Feature - Actions Layer
 * @layer Actions (A in CDAT)
 */

import type { Page } from '@playwright/test';
import { Cdat, LocatorState } from '../../utils/Cdat';
import { CartComponents } from './components';
import type { CartItem, CartSummary } from './data';

export class CartActions {
  private readonly components: CartComponents;

  constructor(private readonly page: Page) {
    this.components = new CartComponents(page);
  }

  // ─────────────────────────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────────────────────────

  async navigateToCart(): Promise<void> {
    await this.page.goto('/cart');
    await Cdat.waitForState(this.components.cartContainer, LocatorState.Visible);
  }

  async proceedToCheckout(): Promise<void> {
    await Cdat.waitAndClick(this.components.checkoutButton);
  }

  async continueShopping(): Promise<void> {
    await Cdat.waitAndClick(this.components.continueShoppingButton);
  }

  // ─────────────────────────────────────────────────────────────────
  // CART ITEMS
  // ─────────────────────────────────────────────────────────────────

  async getItemCount(): Promise<number> {
    const isEmpty = await Cdat.checkState(
      this.components.emptyCartMessage,
      LocatorState.Visible,
      1000
    );
    if (isEmpty) {
      return 0;
    }
    return this.components.cartItems.count();
  }

  async updateItemQuantity(itemIndex: number, quantity: number): Promise<void> {
    const input = this.components.getItemQuantityInput(itemIndex);
    await Cdat.waitAndClear(input);
    await Cdat.waitAndFill(input, quantity.toString());
    await input.blur();
  }

  async removeItem(itemIndex: number): Promise<void> {
    const removeBtn = this.components.getRemoveButton(itemIndex);
    await Cdat.waitAndClick(removeBtn);
  }

  async clearCart(): Promise<void> {
    await Cdat.waitAndClick(this.components.clearCartButton);
  }

  async getItemData(itemIndex: number): Promise<CartItem> {
    const item = this.components.getCartItem(itemIndex);

    const name = await item.locator('[data-testid="item-name"]').textContent() ?? '';
    const priceText = await item.locator('[data-testid="item-price"]').textContent() ?? '0';
    const quantityText = await item.locator('input[type="number"]').inputValue();
    const subtotalText = await item.locator('[data-testid="item-subtotal"]').textContent() ?? '0';

    return {
      name,
      sku: '',
      price: parseFloat(priceText.replace(/[^0-9.]/g, '')),
      quantity: parseInt(quantityText, 10),
      subtotal: parseFloat(subtotalText.replace(/[^0-9.]/g, '')),
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // DISCOUNT CODES
  // ─────────────────────────────────────────────────────────────────

  async applyDiscountCode(code: string): Promise<void> {
    await Cdat.waitAndFill(this.components.discountCode, code);
    await Cdat.waitAndClick(this.components.applyDiscountButton);
  }

  async isDiscountApplied(): Promise<boolean> {
    return Cdat.checkState(this.components.discountApplied, LocatorState.Visible);
  }

  // ─────────────────────────────────────────────────────────────────
  // CART SUMMARY
  // ─────────────────────────────────────────────────────────────────

  async getCartSummary(): Promise<CartSummary> {
    const parsePrice = async (locator: typeof this.components.subtotal): Promise<number> => {
      const text = await Cdat.waitForText(locator);
      return parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
    };

    return {
      subtotal: await parsePrice(this.components.subtotal),
      shipping: await parsePrice(this.components.shippingCost),
      tax: await parsePrice(this.components.taxAmount),
      discount: 0,
      total: await parsePrice(this.components.totalAmount),
    };
  }

  async getTotal(): Promise<number> {
    const text = await Cdat.waitForText(this.components.totalAmount);
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  // ─────────────────────────────────────────────────────────────────
  // STATE CHECKS
  // ─────────────────────────────────────────────────────────────────

  async isCartEmpty(): Promise<boolean> {
    return Cdat.checkState(this.components.emptyCartMessage, LocatorState.Visible);
  }

  async isCheckoutEnabled(): Promise<boolean> {
    return this.components.checkoutButton.isEnabled();
  }
}
