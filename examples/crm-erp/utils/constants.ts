/**
 * Constants for CRM/ERP examples
 * Following production CRM/ERP patterns
 */

/**
 * Timeout constants for different operations
 * Extracted from production usage patterns
 */
export { TIMEOUTS as CrmTimeouts } from '@cdat/utils';

/**
 * Common selectors used across CRM/ERP features
 */
export class CommonSelectors {
  // Loading and progress indicators
  static readonly PROGRESS_BAR = '[role="progressbar"]';
  static readonly LOADING_SPINNER = '[data-testid="loading-spinner"]';
  static readonly MODAL_LOADER = '.modal-loader';

  // Navigation elements
  static readonly MAIN_MENU = '[data-testid="main-menu"]';
  static readonly BREADCRUMB = '[data-testid="breadcrumb"]';
  static readonly PAGE_TITLE = '[data-testid="page-title"]';

  // Form elements
  static readonly SUBMIT_BUTTON = '[data-testid="submit-button"]';
  static readonly CANCEL_BUTTON = '[data-testid="cancel-button"]';
  static readonly FORM_ERROR = '[data-testid="form-error"]';
  static readonly FIELD_ERROR = '[data-testid="field-error"]';

  // Data grid elements
  static readonly DATA_GRID = '[data-testid="data-grid"]';
  static readonly GRID_ROW = '[data-testid="grid-row"]';
  static readonly GRID_CELL = '[data-testid="grid-cell"]';
  static readonly GRID_HEADER = '[data-testid="grid-header"]';
  static readonly FILTER_BUTTON = '[data-testid="filter-button"]';
  static readonly SORT_BUTTON = '[data-testid="sort-button"]';

  // Modal and dialog elements
  static readonly MODAL = '[data-testid="modal"]';
  static readonly MODAL_HEADER = '[data-testid="modal-header"]';
  static readonly MODAL_BODY = '[data-testid="modal-body"]';
  static readonly MODAL_FOOTER = '[data-testid="modal-footer"]';
  static readonly CLOSE_BUTTON = '[data-testid="close-button"]';

  // Notification elements
  static readonly NOTIFICATION = '[data-testid="notification"]';
  static readonly SUCCESS_MESSAGE = '[data-testid="success-message"]';
  static readonly ERROR_MESSAGE = '[data-testid="error-message"]';
  static readonly WARNING_MESSAGE = '[data-testid="warning-message"]';
}

/**
 * Validation messages used in forms
 */
export class ValidationMessages {
  static readonly REQUIRED_FIELD = 'This field is required';
  static readonly INVALID_EMAIL = 'Please enter a valid email address';
  static readonly INVALID_PHONE = 'Please enter a valid phone number';
  static readonly INVALID_DATE = 'Please enter a valid date';
  static readonly PASSWORD_TOO_SHORT = 'Password must be at least 8 characters long';
  static readonly PASSWORDS_DONT_MATCH = 'Passwords do not match';
  static readonly INVALID_POSTAL_CODE = 'Please enter a valid postal code';
  static readonly FIELD_TOO_LONG = 'Field exceeds maximum length';
  static readonly FIELD_TOO_SHORT = 'Field is below minimum length';
}

/**
 * Test data constants
 */
export class TestData {
  static readonly DEFAULT_PASSWORD = 'TestPass123!';
  static readonly TEST_EMAIL_DOMAIN = '@example.com';
  static readonly DEFAULT_COUNTRY = 'United States';
  static readonly DEFAULT_CURRENCY = 'USD';
  static readonly TEST_PHONE = '+1-555-0123';
  static readonly TEST_POSTAL_CODE = '12345';
}

/**
 * Routes used in the CRM/ERP application
 */
export class Routes {
  static readonly HOME = '/';
  static readonly DASHBOARD = '/dashboard';
  static readonly USERS = '/users';
  static readonly USER_CREATE = '/users/create';
  static readonly USER_EDIT = '/users/edit';
  static readonly ENTITIES = '/entities';
  static readonly ENTITY_CREATE = '/entities/create';
  static readonly ENTITY_EDIT = '/entities/edit';
  static readonly DOCUMENTS = '/documents';
  static readonly SETTINGS = '/settings';
  static readonly PROFILE = '/profile';
  static readonly LOGIN = '/login';
}

/**
 * Grid configuration constants
 */
export class GridConfig {
  static readonly DEFAULT_PAGE_SIZE = 25;
  static readonly PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
  static readonly MAX_BULK_SELECTION = 1000;
  static readonly SORT_DIRECTIONS = ['asc', 'desc'];
  static readonly DEFAULT_SORT_FIELD = 'createdAt';
  static readonly DEFAULT_SORT_DIRECTION = 'desc';
}