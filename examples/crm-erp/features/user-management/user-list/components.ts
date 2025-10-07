/**
 * UserListComponents - Locators for user management list interface
 *
 * Extracted from production CRM/ERP patterns
 * Features: Advanced filtering, bulk operations, user roles management
 */

import { Locator, Page } from '@playwright/test';

export class UserListComponents {
  // Page header selectors
  private readonly PAGE_TITLE = '[data-testid="user-list-title"]';
  private readonly ADD_USER_BUTTON = '[data-testid="add-user-button"]';
  private readonly BULK_ACTIONS_BUTTON = '[data-testid="bulk-actions-button"]';

  // Search and filter selectors
  private readonly SEARCH_INPUT = '[data-testid="user-search-input"]';
  private readonly SEARCH_BUTTON = '[data-testid="search-button"]';
  private readonly CLEAR_SEARCH_BUTTON = '[data-testid="clear-search-button"]';
  private readonly FILTER_TOGGLE = '[data-testid="filter-toggle"]';
  private readonly ACTIVE_FILTERS_COUNT = '[data-testid="active-filters-count"]';

  // Data grid selectors
  private readonly USER_TABLE = '[data-testid="user-table"]';
  private readonly TABLE_HEADER = '[data-testid="table-header"]';
  private readonly TABLE_BODY = '[data-testid="table-body"]';
  private readonly TABLE_ROW = '[data-testid="user-row"]';
  private readonly SELECT_ALL_CHECKBOX = '[data-testid="select-all-checkbox"]';

  // Column header selectors (for sorting)
  private readonly EMAIL_HEADER = '[data-testid="email-header"]';
  private readonly NAME_HEADER = '[data-testid="name-header"]';
  private readonly ROLE_HEADER = '[data-testid="role-header"]';
  private readonly STATUS_HEADER = '[data-testid="status-header"]';
  private readonly CREATED_DATE_HEADER = '[data-testid="created-date-header"]';

  // Filter panel selectors
  private readonly FILTER_PANEL = '[data-testid="filter-panel"]';
  private readonly ROLE_FILTER = '[data-testid="role-filter"]';
  private readonly STATUS_FILTER = '[data-testid="status-filter"]';
  private readonly DEPARTMENT_FILTER = '[data-testid="department-filter"]';
  private readonly DATE_RANGE_FILTER = '[data-testid="date-range-filter"]';
  private readonly APPLY_FILTERS_BUTTON = '[data-testid="apply-filters"]';
  private readonly CLEAR_FILTERS_BUTTON = '[data-testid="clear-filters"]';

  // Pagination selectors
  private readonly PAGINATION = '[data-testid="pagination"]';
  private readonly PAGE_SIZE_SELECT = '[data-testid="page-size-select"]';
  private readonly FIRST_PAGE_BUTTON = '[data-testid="first-page"]';
  private readonly PREVIOUS_PAGE_BUTTON = '[data-testid="previous-page"]';
  private readonly NEXT_PAGE_BUTTON = '[data-testid="next-page"]';
  private readonly LAST_PAGE_BUTTON = '[data-testid="last-page"]';
  private readonly PAGE_INFO = '[data-testid="page-info"]';

  // Row action selectors
  private readonly ROW_ACTIONS_MENU = '[data-testid="row-actions-menu"]';
  private readonly EDIT_USER_BUTTON = '[data-testid="edit-user"]';
  private readonly VIEW_USER_BUTTON = '[data-testid="view-user"]';
  private readonly DELETE_USER_BUTTON = '[data-testid="delete-user"]';
  private readonly ACTIVATE_USER_BUTTON = '[data-testid="activate-user"]';
  private readonly DEACTIVATE_USER_BUTTON = '[data-testid="deactivate-user"]';

  // Bulk operations selectors
  private readonly BULK_ACTIONS_PANEL = '[data-testid="bulk-actions-panel"]';
  private readonly BULK_ACTIVATE_BUTTON = '[data-testid="bulk-activate"]';
  private readonly BULK_DEACTIVATE_BUTTON = '[data-testid="bulk-deactivate"]';
  private readonly BULK_DELETE_BUTTON = '[data-testid="bulk-delete"]';
  private readonly BULK_EXPORT_BUTTON = '[data-testid="bulk-export"]';

  // Confirmation dialog selectors
  private readonly CONFIRMATION_DIALOG = '[data-testid="confirmation-dialog"]';
  private readonly CONFIRM_BUTTON = '[data-testid="confirm-button"]';
  private readonly CANCEL_BUTTON = '[data-testid="cancel-button"]';

  // Loading and empty state selectors
  private readonly LOADING_SPINNER = '[data-testid="loading-spinner"]';
  private readonly EMPTY_STATE = '[data-testid="empty-state"]';
  private readonly ERROR_STATE = '[data-testid="error-state"]';

  constructor(private page: Page) {}

  // Page header getters
  get pageTitle(): Locator {
    return this.page.locator(this.PAGE_TITLE);
  }

  get addUserButton(): Locator {
    return this.page.locator(this.ADD_USER_BUTTON);
  }

  get bulkActionsButton(): Locator {
    return this.page.locator(this.BULK_ACTIONS_BUTTON);
  }

  // Search and filter getters
  get searchInput(): Locator {
    return this.page.locator(this.SEARCH_INPUT);
  }

  get searchButton(): Locator {
    return this.page.locator(this.SEARCH_BUTTON);
  }

  get clearSearchButton(): Locator {
    return this.page.locator(this.CLEAR_SEARCH_BUTTON);
  }

  get filterToggle(): Locator {
    return this.page.locator(this.FILTER_TOGGLE);
  }

  get activeFiltersCount(): Locator {
    return this.page.locator(this.ACTIVE_FILTERS_COUNT);
  }

  // Data grid getters
  get userTable(): Locator {
    return this.page.locator(this.USER_TABLE);
  }

  get tableHeader(): Locator {
    return this.page.locator(this.TABLE_HEADER);
  }

  get tableBody(): Locator {
    return this.page.locator(this.TABLE_BODY);
  }

  get tableRows(): Locator {
    return this.page.locator(this.TABLE_ROW);
  }

  get selectAllCheckbox(): Locator {
    return this.page.locator(this.SELECT_ALL_CHECKBOX);
  }

  // Column header getters
  get emailHeader(): Locator {
    return this.page.locator(this.EMAIL_HEADER);
  }

  get nameHeader(): Locator {
    return this.page.locator(this.NAME_HEADER);
  }

  get roleHeader(): Locator {
    return this.page.locator(this.ROLE_HEADER);
  }

  get statusHeader(): Locator {
    return this.page.locator(this.STATUS_HEADER);
  }

  get createdDateHeader(): Locator {
    return this.page.locator(this.CREATED_DATE_HEADER);
  }

  // Filter panel getters
  get filterPanel(): Locator {
    return this.page.locator(this.FILTER_PANEL);
  }

  get roleFilter(): Locator {
    return this.page.locator(this.ROLE_FILTER);
  }

  get statusFilter(): Locator {
    return this.page.locator(this.STATUS_FILTER);
  }

  get departmentFilter(): Locator {
    return this.page.locator(this.DEPARTMENT_FILTER);
  }

  get dateRangeFilter(): Locator {
    return this.page.locator(this.DATE_RANGE_FILTER);
  }

  get applyFiltersButton(): Locator {
    return this.page.locator(this.APPLY_FILTERS_BUTTON);
  }

  get clearFiltersButton(): Locator {
    return this.page.locator(this.CLEAR_FILTERS_BUTTON);
  }

  // Pagination getters
  get pagination(): Locator {
    return this.page.locator(this.PAGINATION);
  }

  get pageSizeSelect(): Locator {
    return this.page.locator(this.PAGE_SIZE_SELECT);
  }

  get firstPageButton(): Locator {
    return this.page.locator(this.FIRST_PAGE_BUTTON);
  }

  get previousPageButton(): Locator {
    return this.page.locator(this.PREVIOUS_PAGE_BUTTON);
  }

  get nextPageButton(): Locator {
    return this.page.locator(this.NEXT_PAGE_BUTTON);
  }

  get lastPageButton(): Locator {
    return this.page.locator(this.LAST_PAGE_BUTTON);
  }

  get pageInfo(): Locator {
    return this.page.locator(this.PAGE_INFO);
  }

  // Bulk actions getters
  get bulkActionsPanel(): Locator {
    return this.page.locator(this.BULK_ACTIONS_PANEL);
  }

  get bulkActivateButton(): Locator {
    return this.page.locator(this.BULK_ACTIVATE_BUTTON);
  }

  get bulkDeactivateButton(): Locator {
    return this.page.locator(this.BULK_DEACTIVATE_BUTTON);
  }

  get bulkDeleteButton(): Locator {
    return this.page.locator(this.BULK_DELETE_BUTTON);
  }

  get bulkExportButton(): Locator {
    return this.page.locator(this.BULK_EXPORT_BUTTON);
  }

  // Confirmation dialog getters
  get confirmationDialog(): Locator {
    return this.page.locator(this.CONFIRMATION_DIALOG);
  }

  get confirmButton(): Locator {
    return this.page.locator(this.CONFIRM_BUTTON);
  }

  get cancelButton(): Locator {
    return this.page.locator(this.CANCEL_BUTTON);
  }

  // Loading and state getters
  get loadingSpinner(): Locator {
    return this.page.locator(this.LOADING_SPINNER);
  }

  get emptyState(): Locator {
    return this.page.locator(this.EMPTY_STATE);
  }

  get errorState(): Locator {
    return this.page.locator(this.ERROR_STATE);
  }

  // Dynamic getters - methods for specific rows and cells

  /**
   * Gets a user row by email address
   */
  getUserRowByEmail(email: string): Locator {
    return this.page.locator(`${this.TABLE_ROW}:has-text("${email}")`);
  }

  /**
   * Gets a user row by index
   */
  getUserRowByIndex(index: number): Locator {
    return this.tableRows.nth(index);
  }

  /**
   * Gets the checkbox for a specific user row
   */
  getUserCheckbox(email: string): Locator {
    return this.getUserRowByEmail(email).locator('[data-testid="user-checkbox"]');
  }

  /**
   * Gets the actions menu for a specific user row
   */
  getUserActionsMenu(email: string): Locator {
    return this.getUserRowByEmail(email).locator('[data-testid="row-actions-menu"]');
  }

  /**
   * Gets a specific cell in a user row
   */
  getUserCell(email: string, cellType: 'name' | 'role' | 'status' | 'department' | 'lastLogin'): Locator {
    return this.getUserRowByEmail(email).locator(`[data-testid="user-${cellType}"]`);
  }

  /**
   * Gets the status indicator for a specific user
   */
  getUserStatus(email: string): Locator {
    return this.getUserRowByEmail(email).locator('[data-testid="user-status-indicator"]');
  }

  /**
   * Gets filter option by text
   */
  getFilterOption(filterType: 'role' | 'status' | 'department', optionText: string): Locator {
    return this.page.locator(`[data-testid="${filterType}-filter-option"]:has-text("${optionText}")`);
  }
}