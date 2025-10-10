/**
 * UserListActions - Business logic for user management list operations
 *
 * Extracted from production CRM/ERP patterns
 * Features: Search, filtering, sorting, pagination, bulk operations
 * Zero Rules: No any, no waitForTimeout, no else statements
 */

import { Page, expect } from '@playwright/test';
import { Cdat, LocatorState, CrmTimeouts } from '../../../utils';
import { UserListComponents } from './components';
import {
  UserSearchCriteria,
  BulkOperationType,
  SortConfig,
  PaginationConfig,
  UserValidationMessages,
  UserSuccessMessages,
} from './data';

export class UserListActions {
  private components: UserListComponents;

  constructor(private page: Page) {
    this.components = new UserListComponents(this.page);
  }

  /**
   * Navigates to the user list page and waits for it to load
   */
  async navigateToUserList(): Promise<void> {
    await this.page.goto('/users');
    await Cdat.waitForState(this.components.userTable, LocatorState.Visible);
    await this.waitForGridLoad();
  }

  /**
   * Waits for the user grid to finish loading
   */
  async waitForGridLoad(): Promise<void> {
    // Wait for loading spinner to disappear
    await Cdat.waitForState(
      this.components.loadingSpinner,
      LocatorState.Hidden,
      CrmTimeouts.GRID_RELOAD_TIMEOUT
    );

    // Ensure we have data or see empty state
    const hasData = await Cdat.checkState(this.components.tableRows.first(), LocatorState.Visible, 2000);
    if (!hasData) {
      await Cdat.waitForState(this.components.emptyState, LocatorState.Visible);
    }
  }

  /**
   * Performs a search for users by query
   */
  async searchUsers(query: string): Promise<void> {
    if (query.length < 3) {
      throw new Error(UserValidationMessages.SEARCH_MIN_LENGTH);
    }

    await Cdat.waitAndFill(this.components.searchInput, query);
    await Cdat.waitAndClick(this.components.searchButton);
    await this.waitForGridLoad();
  }

  /**
   * Clears the current search
   */
  async clearSearch(): Promise<void> {
    const hasClearButton = await Cdat.checkState(this.components.clearSearchButton, LocatorState.Visible, 1000);
    if (!hasClearButton) {
      return; // No search to clear
    }

    await Cdat.waitAndClick(this.components.clearSearchButton);
    await this.waitForGridLoad();
  }

  /**
   * Opens the filter panel
   */
  async openFilterPanel(): Promise<void> {
    const isFilterPanelVisible = await Cdat.checkState(this.components.filterPanel, LocatorState.Visible, 1000);
    if (isFilterPanelVisible) {
      return; // Panel already open
    }

    await Cdat.waitAndClick(this.components.filterToggle);
    await Cdat.waitForState(this.components.filterPanel, LocatorState.Visible);
  }

  /**
   * Applies filters to the user list
   */
  async applyFilters(criteria: UserSearchCriteria): Promise<void> {
    await this.openFilterPanel();

    if (criteria.role) {
      await Cdat.waitAndClick(this.components.roleFilter);
      await Cdat.waitAndClick(this.components.getFilterOption('role', criteria.role));
    }

    if (criteria.status) {
      await Cdat.waitAndClick(this.components.statusFilter);
      await Cdat.waitAndClick(this.components.getFilterOption('status', criteria.status));
    }

    if (criteria.department) {
      await Cdat.waitAndClick(this.components.departmentFilter);
      await Cdat.waitAndClick(this.components.getFilterOption('department', criteria.department));
    }

    if (criteria.dateRange) {
      await this.setDateRangeFilter(criteria.dateRange.from, criteria.dateRange.to);
    }

    await Cdat.waitAndClick(this.components.applyFiltersButton);
    await this.waitForGridLoad();
  }

  /**
   * Sets date range filter
   */
  private async setDateRangeFilter(fromDate: string, toDate: string): Promise<void> {
    const dateFilter = this.components.dateRangeFilter;
    const fromInput = dateFilter.locator('[data-testid="date-from"]');
    const toInput = dateFilter.locator('[data-testid="date-to"]');

    await Cdat.waitAndFill(fromInput, fromDate);
    await Cdat.waitAndFill(toInput, toDate);
  }

  /**
   * Clears all active filters
   */
  async clearAllFilters(): Promise<void> {
    const hasActiveFilters = await Cdat.checkState(this.components.activeFiltersCount, LocatorState.Visible, 1000);
    if (!hasActiveFilters) {
      return; // No filters to clear
    }

    await this.openFilterPanel();
    await Cdat.waitAndClick(this.components.clearFiltersButton);
    await this.waitForGridLoad();
  }

  /**
   * Sorts the user list by specified field and direction
   */
  async sortUsers(config: SortConfig): Promise<void> {
    const headerMap = {
      email: this.components.emailHeader,
      firstName: this.components.nameHeader,
      lastName: this.components.nameHeader,
      role: this.components.roleHeader,
      status: this.components.statusHeader,
      createdAt: this.components.createdDateHeader,
      lastLoginAt: this.components.createdDateHeader,
    };

    const header = headerMap[config.field];
    if (!header) {
      throw new Error(`Unknown sort field: ${config.field}`);
    }

    // Click header to sort
    await Cdat.waitAndClick(header);

    // Check current direction and click again if needed for desc
    if (config.direction === 'desc') {
      const currentDirection = await header.getAttribute('data-sort-direction');
      if (currentDirection !== 'desc') {
        await Cdat.waitAndClick(header);
      }
    }

    await this.waitForGridLoad();
  }

  /**
   * Changes the page size
   */
  async changePageSize(size: 10 | 25 | 50 | 100): Promise<void> {
    await Cdat.waitAndClick(this.components.pageSizeSelect);
    const option = this.page.locator(`[data-testid="page-size-option-${size}"]`);
    await Cdat.waitAndClick(option);
    await this.waitForGridLoad();
  }

  /**
   * Navigates to a specific page
   */
  async navigateToPage(pageNumber: number): Promise<void> {
    if (pageNumber === 1) {
      await Cdat.waitAndClick(this.components.firstPageButton);
    } else {
      // For other pages, use page input or click multiple times
      const pageInput = this.components.pagination.locator('[data-testid="page-input"]');
      const hasPageInput = await Cdat.checkState(pageInput, LocatorState.Visible, 1000);

      if (hasPageInput) {
        await Cdat.waitAndFill(pageInput, pageNumber.toString());
        await this.page.keyboard.press('Enter');
      } else {
        // Fallback: use next/previous buttons
        await this.navigateToPageWithButtons(pageNumber);
      }
    }

    await this.waitForGridLoad();
  }

  /**
   * Helper method to navigate using next/previous buttons
   */
  private async navigateToPageWithButtons(targetPage: number): Promise<void> {
    const currentPageText = await Cdat.waitForText(this.components.pageInfo);
    const currentPage = this.extractCurrentPageNumber(currentPageText);

    if (currentPage === targetPage) {
      return;
    }

    const button = currentPage < targetPage ? this.components.nextPageButton : this.components.previousPageButton;
    const steps = Math.abs(targetPage - currentPage);

    for (let i = 0; i < steps; i++) {
      await Cdat.waitAndClick(button);
      await this.waitForGridLoad();
    }
  }

  /**
   * Extracts current page number from page info text
   */
  private extractCurrentPageNumber(pageInfoText: string): number {
    const match = pageInfoText.match(/Page (\d+) of \d+/);
    return match ? parseInt(match[1], 10) : 1;
  }

  /**
   * Selects a user by email
   */
  async selectUser(email: string): Promise<void> {
    const checkbox = this.components.getUserCheckbox(email);
    await Cdat.waitAndClick(checkbox);
  }

  /**
   * Selects multiple users
   */
  async selectMultipleUsers(emails: string[]): Promise<void> {
    for (const email of emails) {
      await this.selectUser(email);
    }
  }

  /**
   * Selects all users on current page
   */
  async selectAllUsers(): Promise<void> {
    await Cdat.waitAndClick(this.components.selectAllCheckbox);
  }

  /**
   * Gets the count of selected users
   */
  async getSelectedUserCount(): Promise<number> {
    const selectedCheckboxes = this.page.locator('[data-testid="user-checkbox"]:checked');
    return await selectedCheckboxes.count();
  }

  /**
   * Performs bulk operation on selected users
   */
  async performBulkOperation(operation: BulkOperationType): Promise<void> {
    const selectedCount = await this.getSelectedUserCount();
    if (selectedCount === 0) {
      throw new Error(UserValidationMessages.BULK_SELECTION_REQUIRED);
    }

    if (selectedCount > 1000) {
      throw new Error(UserValidationMessages.BULK_SELECTION_LIMIT);
    }

    // Open bulk actions panel
    await Cdat.waitAndClick(this.components.bulkActionsButton);
    await Cdat.waitForState(this.components.bulkActionsPanel, LocatorState.Visible);

    // Click appropriate bulk action
    const actionButtonMap = {
      [BulkOperationType.Activate]: this.components.bulkActivateButton,
      [BulkOperationType.Deactivate]: this.components.bulkDeactivateButton,
      [BulkOperationType.Delete]: this.components.bulkDeleteButton,
      [BulkOperationType.Export]: this.components.bulkExportButton,
    };

    const button = actionButtonMap[operation];
    if (!button) {
      throw new Error(`Unknown bulk operation: ${operation}`);
    }

    await Cdat.waitAndClick(button);

    // Handle confirmation for destructive operations
    if (operation === BulkOperationType.Delete) {
      await this.confirmBulkOperation();
    }

    await this.waitForGridLoad();
  }

  /**
   * Confirms a bulk operation in the confirmation dialog
   */
  private async confirmBulkOperation(): Promise<void> {
    await Cdat.waitForState(this.components.confirmationDialog, LocatorState.Visible);
    await Cdat.waitAndClick(this.components.confirmButton);
    await Cdat.waitForState(this.components.confirmationDialog, LocatorState.Hidden);
  }

  /**
   * Cancels a bulk operation
   */
  async cancelBulkOperation(): Promise<void> {
    const isDialogVisible = await Cdat.checkState(this.components.confirmationDialog, LocatorState.Visible, 1000);
    if (!isDialogVisible) {
      return; // No dialog to cancel
    }

    await Cdat.waitAndClick(this.components.cancelButton);
    await Cdat.waitForState(this.components.confirmationDialog, LocatorState.Hidden);
  }

  /**
   * Opens actions menu for a specific user
   */
  async openUserActionsMenu(email: string): Promise<void> {
    const actionsMenu = this.components.getUserActionsMenu(email);
    await Cdat.waitAndClick(actionsMenu);
    await Cdat.waitForState(this.components.getUserRowByEmail(email).locator('[data-testid="actions-dropdown"]'), LocatorState.Visible);
  }

  /**
   * Edits a user by opening the edit form
   */
  async editUser(email: string): Promise<void> {
    await this.openUserActionsMenu(email);
    const editButton = this.components.getUserRowByEmail(email).locator('[data-testid="edit-user-action"]');
    await Cdat.waitAndClick(editButton);
    // Wait for navigation to edit page
    await Cdat.waitForNavigation(this.page, /\/users\/.*\/edit/);
  }

  /**
   * Views user details
   */
  async viewUser(email: string): Promise<void> {
    await this.openUserActionsMenu(email);
    const viewButton = this.components.getUserRowByEmail(email).locator('[data-testid="view-user-action"]');
    await Cdat.waitAndClick(viewButton);
    // Wait for navigation to user details page
    await Cdat.waitForNavigation(this.page, /\/users\/.*/);
  }

  /**
   * Deletes a single user
   */
  async deleteUser(email: string): Promise<void> {
    await this.openUserActionsMenu(email);
    const deleteButton = this.components.getUserRowByEmail(email).locator('[data-testid="delete-user-action"]');
    await Cdat.waitAndClick(deleteButton);
    await this.confirmBulkOperation();
  }

  /**
   * Activates a user
   */
  async activateUser(email: string): Promise<void> {
    await this.openUserActionsMenu(email);
    const activateButton = this.components.getUserRowByEmail(email).locator('[data-testid="activate-user-action"]');
    await Cdat.waitAndClick(activateButton);
    await this.waitForGridLoad();
  }

  /**
   * Deactivates a user
   */
  async deactivateUser(email: string): Promise<void> {
    await this.openUserActionsMenu(email);
    const deactivateButton = this.components.getUserRowByEmail(email).locator('[data-testid="deactivate-user-action"]');
    await Cdat.waitAndClick(deactivateButton);
    await this.waitForGridLoad();
  }

  /**
   * Gets the total number of users displayed
   */
  async getTotalUserCount(): Promise<number> {
    const pageInfoText = await Cdat.waitForText(this.components.pageInfo);
    const match = pageInfoText.match(/(\d+) total/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Gets the number of users on current page
   */
  async getCurrentPageUserCount(): Promise<number> {
    return await this.components.tableRows.count();
  }

  /**
   * Verifies that a user exists in the list
   */
  async verifyUserExists(email: string): Promise<boolean> {
    return await Cdat.checkState(this.components.getUserRowByEmail(email), LocatorState.Visible, 2000);
  }

  /**
   * Verifies that a user does not exist in the list
   */
  async verifyUserNotExists(email: string): Promise<boolean> {
    return !(await this.verifyUserExists(email));
  }

  /**
   * Gets user status from the list
   */
  async getUserStatus(email: string): Promise<string> {
    const statusElement = this.components.getUserStatus(email);
    return await Cdat.waitForText(statusElement);
  }

  /**
   * Verifies user status matches expected value
   */
  async verifyUserStatus(email: string, expectedStatus: string): Promise<void> {
    const actualStatus = await this.getUserStatus(email);
    expect(actualStatus.toLowerCase()).toBe(expectedStatus.toLowerCase());
  }

  /**
   * Navigates to create new user page
   */
  async openCreateUserForm(): Promise<void> {
    await Cdat.waitAndClick(this.components.addUserButton);
    await Cdat.waitForNavigation(this.page, /\/users\/create/);
  }

  /**
   * Waits for success message to appear
   */
  async waitForSuccessMessage(expectedMessage?: string): Promise<string> {
    const successMessage = this.page.locator('[data-testid="success-message"]');
    const messageText = await Cdat.waitForText(successMessage);

    if (expectedMessage) {
      expect(messageText).toContain(expectedMessage);
    }

    return messageText;
  }

  /**
   * Waits for error message to appear
   */
  async waitForErrorMessage(expectedMessage?: string): Promise<string> {
    const errorMessage = this.page.locator('[data-testid="error-message"]');
    const messageText = await Cdat.waitForText(errorMessage);

    if (expectedMessage) {
      expect(messageText).toContain(expectedMessage);
    }

    return messageText;
  }

  /**
   * Refreshes the user list
   */
  async refreshUserList(): Promise<void> {
    const refreshButton = this.page.locator('[data-testid="refresh-button"]');
    const hasRefreshButton = await Cdat.checkState(refreshButton, LocatorState.Visible, 1000);

    if (hasRefreshButton) {
      await Cdat.waitAndClick(refreshButton);
    } else {
      await this.page.reload();
    }

    await this.waitForGridLoad();
  }
}