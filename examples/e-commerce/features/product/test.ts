/**
 * Product Feature - Tests Layer
 * @layer Tests (T in CDAT)
 */

import { test, expect } from '@playwright/test';
import { ProductActions } from './actions';
import { ProductComponents } from './components';
import { SAMPLE_PRODUCTS, DEFAULT_SELECTION, QUANTITY_LIMITS } from './data';

test.describe('Product Feature', () => {
  let actions: ProductActions;
  let components: ProductComponents;

  test.beforeEach(async ({ page }) => {
    actions = new ProductActions(page);
    components = new ProductComponents(page);
  });

  test.describe('Product Display', () => {
    test('TC_PROD_001: Given product page, When loaded, Then product info is displayed', async () => {
      await actions.navigateToProduct(SAMPLE_PRODUCTS.tshirt.id);

      await expect(components.productTitle).toBeVisible();
      await expect(components.productPrice).toBeVisible();
      await expect(components.mainImage).toBeVisible();
    });

    test('TC_PROD_002: Given product with discount, When loaded, Then original price is shown', async () => {
      await actions.navigateToProduct(SAMPLE_PRODUCTS.tshirt.id);

      await expect(components.originalPrice).toBeVisible();
      await expect(components.discountBadge).toBeVisible();
    });
  });

  test.describe('Variant Selection', () => {
    test('TC_PROD_003: Given product with sizes, When size selected, Then selection is reflected', async () => {
      await actions.navigateToProduct(SAMPLE_PRODUCTS.tshirt.id);

      const size = 'L';
      await actions.selectSize(size);

      const sizeOption = components.getSizeOption(size);
      await expect(sizeOption).toHaveAttribute('aria-pressed', 'true');
    });
  });

  test.describe('Quantity Control', () => {
    test('TC_PROD_004: Given product, When quantity increased, Then value updates', async () => {
      await actions.navigateToProduct(SAMPLE_PRODUCTS.tshirt.id);

      await actions.increaseQuantity();
      const quantity = await actions.getQuantity();

      expect(quantity).toBe(2);
    });

    test('TC_PROD_005: Given quantity at minimum, When decreased, Then stays at minimum', async () => {
      await actions.navigateToProduct(SAMPLE_PRODUCTS.tshirt.id);

      await actions.decreaseQuantity();
      const quantity = await actions.getQuantity();

      expect(quantity).toBe(QUANTITY_LIMITS.min);
    });
  });

  test.describe('Add to Cart', () => {
    test('TC_PROD_006: Given in-stock product, When add to cart, Then cart updates', async ({
      page,
    }) => {
      await actions.navigateToProduct(SAMPLE_PRODUCTS.tshirt.id);

      await actions.addToCartWithSelection(DEFAULT_SELECTION);

      // Verify cart notification or count update
      const cartCount = page.locator('[data-testid="cart-count"]');
      await expect(cartCount).toContainText('1');
    });

    test('TC_PROD_007: Given out-of-stock product, Then add to cart is disabled', async () => {
      await actions.navigateToProduct(SAMPLE_PRODUCTS.outOfStock.id);

      const isEnabled = await actions.isAddToCartEnabled();
      expect(isEnabled).toBe(false);
    });
  });
});
