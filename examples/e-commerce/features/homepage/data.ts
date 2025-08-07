/**
 * Homepage Feature - Data Layer
 * @layer Data (D in CDAT)
 */

// ─────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────

export interface ProductCardData {
  name: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  inStock: boolean;
}

export interface CategoryData {
  name: string;
  slug: string;
  productCount: number;
}

export interface SearchQuery {
  term: string;
  expectedResults: number;
}

// ─────────────────────────────────────────────────────────────────
// TEST DATA
// ─────────────────────────────────────────────────────────────────

export const CATEGORIES: CategoryData[] = [
  { name: 'Electronics', slug: 'electronics', productCount: 150 },
  { name: 'Clothing', slug: 'clothing', productCount: 300 },
  { name: 'Home & Garden', slug: 'home-garden', productCount: 200 },
  { name: 'Sports', slug: 'sports', productCount: 100 },
];

export const SEARCH_QUERIES: Record<string, SearchQuery> = {
  valid: { term: 'laptop', expectedResults: 10 },
  noResults: { term: 'xyznonexistent123', expectedResults: 0 },
  specialChars: { term: 'phone case <script>', expectedResults: 5 },
};

export const NEWSLETTER_EMAILS = {
  valid: 'test@example.com',
  invalid: 'invalid-email',
  existing: 'already@subscribed.com',
};

// ─────────────────────────────────────────────────────────────────
// URLS
// ─────────────────────────────────────────────────────────────────

export const HOMEPAGE_URLS = {
  home: '/',
  search: '/search',
  category: (slug: string) => `/category/${slug}`,
} as const;

// ─────────────────────────────────────────────────────────────────
// EXPECTED VALUES
// ─────────────────────────────────────────────────────────────────

export const EXPECTED = {
  minFeaturedProducts: 4,
  maxFeaturedProducts: 12,
  minCategories: 3,
} as const;
