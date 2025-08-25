/**
 * Cart Feature - Components Layer
 * @layer Components (C in CDAT)
 */

import type { Page, Locator } from '@playwright/test';

export class CartComponents {
  // Cart container
  readonly cartContainer: Locator;
  readonly emptyCartMessage: Locator;

  // Cart items
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly itemQuantities: Locator;
  readonly itemSubtotals: Locator;
  readonly removeButtons: Locator;

  // Summary
  readonly subtotal: Locator;
  readonly shippingCost: Locator;
  readonly taxAmount: Locator;
  readonly totalAmount: Locator;
  readonly discountCode: Locator;
  readonly applyDiscountButton: Locator;
  readonly discountApplied: Locator;

  // Actions
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly clearCartButton: Locator;

  constructor(private readonly page: Page) {
    // Cart container
    this.cartContainer = page.locator('[data-testid="cart-container"]');
    this.emptyCartMessage = page.locator('[data-testid="empty-cart"]');

    // Cart items
    this.cartItems = page.locator('[data-testid="cart-item"]');
    this.itemNames = this.cartItems.locator('[data-testid="item-name"]');
    this.itemPrices = this.cartItems.locator('[data-testid="item-price"]');
    this.itemQuantities = this.cartItems.locator('[data-testid="item-quantity"]');
    this.itemSubtotals = this.cartItems.locator('[data-testid="item-subtotal"]');
    this.removeButtons = this.cartItems.locator('[data-testid="remove-item"]');

    // Summary
    this.subtotal = page.locator('[data-testid="subtotal"]');
    this.shippingCost = page.locator('[data-testid="shipping-cost"]');
    this.taxAmount = page.locator('[data-testid="tax-amount"]');
    this.totalAmount = page.locator('[data-testid="total-amount"]');
    this.discountCode = page.locator('[data-testid="discount-code"]');
    this.applyDiscountButton = page.getByRole('button', { name: /apply/i });
    this.discountApplied = page.locator('[data-testid="discount-applied"]');

    // Actions
    this.checkoutButton = page.getByRole('button', { name: /checkout/i });
    this.continueShoppingButton = page.getByRole('link', { name: /continue shopping/i });
    this.clearCartButton = page.getByRole('button', { name: /clear cart/i });
  }

  getCartItem(index: number): Locator {
    return this.cartItems.nth(index);
  }

  getItemQuantityInput(index: number): Locator {
    return this.getCartItem(index).locator('input[type="number"]');
  }

  getRemoveButton(index: number): Locator {
    return this.removeButtons.nth(index);
  }
}
