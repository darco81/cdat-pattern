/**
 * Cart Feature - Data Layer
 * @layer Data (D in CDAT)
 */

// ─────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────

export interface CartItem {
  name: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
  size?: string;
  color?: string;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  valid: boolean;
}

// ─────────────────────────────────────────────────────────────────
// TEST DATA
// ─────────────────────────────────────────────────────────────────

export const DISCOUNT_CODES: Record<string, DiscountCode> = {
  valid10: {
    code: 'SAVE10',
    type: 'percentage',
    value: 10,
    valid: true,
  },
  valid20: {
    code: 'SAVE20',
    type: 'fixed',
    value: 20,
    valid: true,
  },
  expired: {
    code: 'EXPIRED2024',
    type: 'percentage',
    value: 15,
    valid: false,
  },
  invalid: {
    code: 'NOTAREALCODE',
    type: 'percentage',
    value: 0,
    valid: false,
  },
};

export const SHIPPING_THRESHOLDS = {
  freeShippingMinimum: 50,
  standardShippingCost: 5.99,
  expressShippingCost: 12.99,
} as const;

// ─────────────────────────────────────────────────────────────────
// URLS
// ─────────────────────────────────────────────────────────────────

export const CART_URLS = {
  cart: '/cart',
  checkout: '/checkout',
  home: '/',
} as const;

// ─────────────────────────────────────────────────────────────────
// ERROR MESSAGES
// ─────────────────────────────────────────────────────────────────

export const CART_ERRORS = {
  invalidDiscount: 'Invalid discount code',
  expiredDiscount: 'This discount code has expired',
  emptyCart: 'Your cart is empty',
} as const;
