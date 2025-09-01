/**
 * Cart Feature - Tests Layer
 * @layer Tests (T in CDAT)
 */

import { test, expect } from '@playwright/test';
import { CartActions } from './actions';
import { CartComponents } from './components';
import { DISCOUNT_CODES, CART_URLS, CART_ERRORS } from './data';

test.describe('Cart Feature', () => {
  let actions: CartActions;
  let components: CartComponents;

  test.beforeEach(async ({ page }) => {
    actions = new CartActions(page);
    components = new CartComponents(page);
  });

  test.describe('Empty Cart', () => {
    test('TC_CART_001: Given empty cart, When viewed, Then empty message is shown', async () => {
      await actions.navigateToCart();

      const isEmpty = await actions.isCartEmpty();
      expect(isEmpty).toBe(true);
      await expect(components.emptyCartMessage).toContainText(CART_ERRORS.emptyCart);
    });

    test('TC_CART_002: Given empty cart, Then checkout is disabled', async () => {
      await actions.navigateToCart();

      const isEnabled = await actions.isCheckoutEnabled();
      expect(isEnabled).toBe(false);
    });
  });

  test.describe('Cart Items', () => {
    test.beforeEach(async ({ page }) => {
      // Add item to cart via API or UI before tests
      // This would typically use a fixture or API call
    });

    test('TC_CART_003: Given cart with items, When quantity updated, Then subtotal updates', async () => {
      await actions.navigateToCart();

      const initialData = await actions.getItemData(0);
      await actions.updateItemQuantity(0, 2);
      const updatedData = await actions.getItemData(0);

      expect(updatedData.subtotal).toBe(initialData.price * 2);
    });

    test('TC_CART_004: Given cart with items, When item removed, Then item disappears', async () => {
      await actions.navigateToCart();

      const initialCount = await actions.getItemCount();
      await actions.removeItem(0);
      const newCount = await actions.getItemCount();

      expect(newCount).toBe(initialCount - 1);
    });
  });

  test.describe('Discount Codes', () => {
    test('TC_CART_005: Given valid discount code, When applied, Then discount is shown', async () => {
      await actions.navigateToCart();

      await actions.applyDiscountCode(DISCOUNT_CODES.valid10.code);

      const isApplied = await actions.isDiscountApplied();
      expect(isApplied).toBe(true);
    });

    test('TC_CART_006: Given invalid discount code, When applied, Then error is shown', async ({
      page,
    }) => {
      await actions.navigateToCart();

      await actions.applyDiscountCode(DISCOUNT_CODES.invalid.code);

      const errorMessage = page.locator('[data-testid="discount-error"]');
      await expect(errorMessage).toContainText(CART_ERRORS.invalidDiscount);
    });
  });

  test.describe('Checkout Flow', () => {
    test('TC_CART_007: Given cart with items, When checkout clicked, Then checkout page opens', async ({
      page,
    }) => {
      await actions.navigateToCart();

      await actions.proceedToCheckout();

      await expect(page).toHaveURL(new RegExp(CART_URLS.checkout));
    });
  });
});
