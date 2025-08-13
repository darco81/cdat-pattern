/**
 * Homepage Feature - Tests Layer
 * @layer Tests (T in CDAT)
 */

import { test, expect } from '@playwright/test';
import { HomepageActions } from './actions';
import { HomepageComponents } from './components';
import { CATEGORIES, SEARCH_QUERIES, EXPECTED, HOMEPAGE_URLS } from './data';

test.describe('Homepage Feature', () => {
  let actions: HomepageActions;
  let components: HomepageComponents;

  test.beforeEach(async ({ page }) => {
    actions = new HomepageActions(page);
    components = new HomepageComponents(page);
    await actions.navigateToHome();
  });

  test.describe('Page Load', () => {
    test('TC_HOME_001: Given homepage, When loaded, Then header is visible', async () => {
      await expect(components.header).toBeVisible();
      await expect(components.logo).toBeVisible();
    });

    test('TC_HOME_002: Given homepage, When loaded, Then featured products are displayed', async () => {
      const count = await actions.getProductCount();
      expect(count).toBeGreaterThanOrEqual(EXPECTED.minFeaturedProducts);
      expect(count).toBeLessThanOrEqual(EXPECTED.maxFeaturedProducts);
    });

    test('TC_HOME_003: Given homepage, When loaded, Then category navigation is visible', async () => {
      const categoryCount = await actions.getCategoryCount();
      expect(categoryCount).toBeGreaterThanOrEqual(EXPECTED.minCategories);
    });
  });

  test.describe('Search', () => {
    test('TC_HOME_004: Given valid query, When searching, Then results page opens', async ({
      page,
    }) => {
      await actions.search(SEARCH_QUERIES.valid.term);
      await expect(page).toHaveURL(new RegExp(HOMEPAGE_URLS.search));
    });

    test('TC_HOME_005: Given no results query, When searching, Then empty state shown', async ({
      page,
    }) => {
      await actions.search(SEARCH_QUERIES.noResults.term);
      await expect(page.locator('[data-testid="no-results"]')).toBeVisible();
    });
  });

  test.describe('Add to Cart', () => {
    test('TC_HOME_006: Given product, When add to cart clicked, Then cart count increases', async () => {
      const initialCount = await actions.getCartCount();
      await actions.addProductToCart(0);
      const newCount = await actions.getCartCount();
      expect(newCount).toBe(initialCount + 1);
    });
  });

  test.describe('Category Navigation', () => {
    test('TC_HOME_007: Given category link, When clicked, Then category page opens', async ({
      page,
    }) => {
      const category = CATEGORIES[0];
      await actions.navigateToCategory(category.name);
      await expect(page).toHaveURL(new RegExp(category.slug));
    });
  });
});
