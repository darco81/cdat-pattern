/**
 * Product Feature - Data Layer
 * @layer Data (D in CDAT)
 */

// ─────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  description: string;
  inStock: boolean;
  sizes?: string[];
  colors?: string[];
}

export interface ProductSelection {
  size?: string;
  color?: string;
  quantity: number;
}

// ─────────────────────────────────────────────────────────────────
// TEST DATA
// ─────────────────────────────────────────────────────────────────

export const SAMPLE_PRODUCTS: Record<string, Product> = {
  tshirt: {
    id: 'prod-001',
    name: 'Classic T-Shirt',
    sku: 'TSH-001',
    price: 29.99,
    originalPrice: 39.99,
    description: 'Premium cotton t-shirt',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Navy'],
  },
  outOfStock: {
    id: 'prod-002',
    name: 'Limited Edition Jacket',
    sku: 'JAC-002',
    price: 199.99,
    description: 'Exclusive limited edition jacket',
    inStock: false,
    sizes: ['M', 'L'],
    colors: ['Black'],
  },
};

export const DEFAULT_SELECTION: ProductSelection = {
  size: 'M',
  color: 'Black',
  quantity: 1,
};

// ─────────────────────────────────────────────────────────────────
// URLS
// ─────────────────────────────────────────────────────────────────

export const PRODUCT_URLS = {
  product: (id: string) => `/product/${id}`,
  cart: '/cart',
  checkout: '/checkout',
} as const;

// ─────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────

export const QUANTITY_LIMITS = {
  min: 1,
  max: 99,
} as const;
