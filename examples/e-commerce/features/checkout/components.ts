/**
 * Checkout Feature - Components Layer
 * @layer Components (C in CDAT)
 */

import type { Page, Locator } from '@playwright/test';

export class CheckoutComponents {
  // Form container (Selector Composition base)
  readonly form: Locator;

  // Contact info (composed from form)
  readonly emailField: Locator;
  readonly phoneField: Locator;

  // Shipping address (composed from form)
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly addressField: Locator;
  readonly cityField: Locator;
  readonly stateField: Locator;
  readonly zipCodeField: Locator;
  readonly countryField: Locator;

  // Shipping method
  readonly shippingMethods: Locator;
  readonly standardShipping: Locator;
  readonly expressShipping: Locator;

  // Payment
  readonly paymentSection: Locator;
  readonly cardNumber: Locator;
  readonly cardExpiry: Locator;
  readonly cardCvc: Locator;
  readonly cardName: Locator;

  // Summary
  readonly orderSummary: Locator;
  readonly orderItems: Locator;
  readonly orderTotal: Locator;

  // Actions
  readonly placeOrderButton: Locator;
  readonly backToCartLink: Locator;

  // Feedback
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly orderNumber: Locator;

  constructor(private readonly page: Page) {
    // Form container
    this.form = page.locator('[data-testid="checkout-form"]');

    // Contact info (Selector Composition - scoped to form)
    this.emailField = this.form.locator('[data-testid="email"]');
    this.phoneField = this.form.locator('[data-testid="phone"]');

    // Shipping address
    this.firstNameField = this.form.locator('[data-testid="first-name"]');
    this.lastNameField = this.form.locator('[data-testid="last-name"]');
    this.addressField = this.form.locator('[data-testid="address"]');
    this.cityField = this.form.locator('[data-testid="city"]');
    this.stateField = this.form.locator('[data-testid="state"]');
    this.zipCodeField = this.form.locator('[data-testid="zip-code"]');
    this.countryField = this.form.locator('[data-testid="country"]');

    // Shipping method
    this.shippingMethods = page.locator('[data-testid="shipping-methods"]');
    this.standardShipping = this.shippingMethods.getByLabel(/standard/i);
    this.expressShipping = this.shippingMethods.getByLabel(/express/i);

    // Payment
    this.paymentSection = page.locator('[data-testid="payment-section"]');
    this.cardNumber = this.paymentSection.locator('[data-testid="card-number"]');
    this.cardExpiry = this.paymentSection.locator('[data-testid="card-expiry"]');
    this.cardCvc = this.paymentSection.locator('[data-testid="card-cvc"]');
    this.cardName = this.paymentSection.locator('[data-testid="card-name"]');

    // Summary
    this.orderSummary = page.locator('[data-testid="order-summary"]');
    this.orderItems = this.orderSummary.locator('[data-testid="order-item"]');
    this.orderTotal = this.orderSummary.locator('[data-testid="order-total"]');

    // Actions
    this.placeOrderButton = page.getByRole('button', { name: /place order/i });
    this.backToCartLink = page.getByRole('link', { name: /back to cart/i });

    // Feedback
    this.successMessage = page.locator('[data-testid="order-success"]');
    this.errorMessage = page.locator('[data-testid="checkout-error"]');
    this.orderNumber = page.locator('[data-testid="order-number"]');
  }

  getFieldError(fieldName: string): Locator {
    return this.form.locator(`[data-testid="${fieldName}-error"]`);
  }
}
