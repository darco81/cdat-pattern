/**
 * Checkout Feature - Tests Layer
 * @layer Tests (T in CDAT)
 */

import { test, expect } from '@playwright/test';
import { CheckoutActions } from './actions';
import { CheckoutComponents } from './components';
import {
  VALID_CHECKOUT,
  INVALID_CHECKOUT,
  TEST_CARDS,
  CHECKOUT_URLS,
  CHECKOUT_ERRORS,
  ShippingMethod,
} from './data';

test.describe('Checkout Feature', () => {
  let actions: CheckoutActions;
  let components: CheckoutComponents;

  test.beforeEach(async ({ page }) => {
    actions = new CheckoutActions(page);
    components = new CheckoutComponents(page);
    // Assume cart has items (would use fixture or API setup)
    await actions.navigateToCheckout();
  });

  test.describe('Form Display', () => {
    test('TC_CHKOUT_001: Given checkout page, When loaded, Then form is displayed', async () => {
      await expect(components.form).toBeVisible();
      await expect(components.emailField).toBeVisible();
      await expect(components.placeOrderButton).toBeVisible();
    });

    test('TC_CHKOUT_002: Given checkout page, Then order summary is shown', async () => {
      await expect(components.orderSummary).toBeVisible();
      await expect(components.orderTotal).toBeVisible();
    });
  });

  test.describe('Successful Checkout', () => {
    test('TC_CHKOUT_003: Given valid data, When checkout completed, Then success page shown', async ({
      page,
    }) => {
      await actions.completeCheckoutAsGuest(VALID_CHECKOUT);

      await expect(page).toHaveURL(new RegExp(CHECKOUT_URLS.confirmation));
      const isSuccessful = await actions.isOrderSuccessful();
      expect(isSuccessful).toBe(true);
    });

    test('TC_CHKOUT_004: Given successful order, Then order number is displayed', async () => {
      await actions.completeCheckoutAsGuest(VALID_CHECKOUT);

      const orderNumber = await actions.getOrderNumber();
      expect(orderNumber).toMatch(/^[A-Z0-9-]+$/);
    });
  });

  test.describe('Shipping Methods', () => {
    test('TC_CHKOUT_005: Given express shipping selected, Then total updates', async () => {
      const initialTotal = await actions.getOrderTotal();

      await actions.selectShippingMethod(ShippingMethod.Express);

      const newTotal = await actions.getOrderTotal();
      expect(newTotal).toBeGreaterThan(initialTotal);
    });
  });

  test.describe('Validation', () => {
    test('TC_CHKOUT_006: Given invalid email, When submitted, Then error shown', async () => {
      await actions.fillEmail(INVALID_CHECKOUT.contact!.email);
      await actions.placeOrder();

      const error = await actions.getFieldError('email');
      expect(error).toContain(CHECKOUT_ERRORS.invalidEmail);
    });

    test('TC_CHKOUT_007: Given empty required fields, Then validation errors shown', async () => {
      await actions.placeOrder();

      const emailError = components.getFieldError('email');
      await expect(emailError).toBeVisible();
    });
  });

  test.describe('Payment Errors', () => {
    test('TC_CHKOUT_008: Given declined card, When order placed, Then error shown', async () => {
      const data = {
        ...VALID_CHECKOUT,
        payment: {
          ...VALID_CHECKOUT.payment,
          cardNumber: TEST_CARDS.declined,
        },
      };

      await actions.completeCheckoutAsGuest(data);

      const error = await actions.getErrorMessage();
      expect(error).toContain(CHECKOUT_ERRORS.cardDeclined);
    });
  });
});
