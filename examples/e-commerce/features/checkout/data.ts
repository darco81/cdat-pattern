/**
 * Checkout Feature - Data Layer
 * @layer Data (D in CDAT)
 */

// ─────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────

export interface ContactInfo {
  email: string;
  phone: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardName: string;
}

export interface CheckoutData {
  contact: ContactInfo;
  shipping: ShippingAddress;
  payment: PaymentInfo;
}

export enum ShippingMethod {
  Standard = 'standard',
  Express = 'express',
}

// ─────────────────────────────────────────────────────────────────
// TEST DATA
// ─────────────────────────────────────────────────────────────────

export const VALID_CHECKOUT: CheckoutData = {
  contact: {
    email: 'john.doe@example.com',
    phone: '+1234567890',
  },
  shipping: {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  },
  payment: {
    cardNumber: '4242424242424242',
    expiry: '12/28',
    cvc: '123',
    cardName: 'John Doe',
  },
};

export const INVALID_CHECKOUT: Partial<CheckoutData> = {
  contact: {
    email: 'invalid-email',
    phone: '123',
  },
  payment: {
    cardNumber: '1234',
    expiry: '01/20',
    cvc: '12',
    cardName: '',
  },
};

export const TEST_CARDS = {
  success: '4242424242424242',
  declined: '4000000000000002',
  insufficientFunds: '4000000000009995',
  expired: '4000000000000069',
} as const;

// ─────────────────────────────────────────────────────────────────
// URLS
// ─────────────────────────────────────────────────────────────────

export const CHECKOUT_URLS = {
  checkout: '/checkout',
  confirmation: '/order-confirmation',
  cart: '/cart',
} as const;

// ─────────────────────────────────────────────────────────────────
// ERROR MESSAGES
// ─────────────────────────────────────────────────────────────────

export const CHECKOUT_ERRORS = {
  invalidEmail: 'Please enter a valid email address',
  invalidCard: 'Invalid card number',
  cardDeclined: 'Your card was declined',
  requiredField: 'This field is required',
} as const;
