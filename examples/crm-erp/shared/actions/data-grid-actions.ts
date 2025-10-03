/**
 * DataGridActions - Reusable data grid interaction methods
 *
 * Extracted from production CRM/ERP patterns
 * Features: Search, filter, sort, paginate, bulk operations
 * Used across: Users, Documents, Reports, Entities
 */

import { Page, expect } from '@playwright/test';
import { Cdat, LocatorState, CrmTimeouts } from '../../utils';
import { DataGridComponents } from '../components/data-grid';
import { FilterType } from '../../utils/types';

export interface GridSearchOptions {
  query: string;
  columnKey?: string;
  exactMatch?: boolean;
}

export interface GridFilterOptions {
  columnKey: string;
  filterType: FilterType;
  value?: string | string[];
  dateRange?: {
    from: string;
    to: string;
  };
}

export interface GridSortOptions {
  columnKey: string;
  direction: 'asc' | 'desc';
}

export interface GridPaginationOptions {
  pageSize?: 10 | 25 | 50 | 100;
  page?: number;
}

export interface BulkOperationOptions {
  actionName: string;
  selectedRows?: number[];
  selectAll?: boolean;
  requiresConfirmation?: boolean;
}

export class DataGridActions {
  private components: DataGridComponents;

  constructor(private page: Page) {
    this.components = new DataGridComponents(this.page);
  }

  /**
   * Waits for the grid to load completely
   */
  async waitForGridLoad(): Promise<void> {
    // Wait for loading overlay to disappear
    await Cdat.waitForState(
      this.components.loadingOverlay,
      LocatorState.Hidden,
      CrmTimeouts.GRID_RELOAD_TIMEOUT
    );

    // Ensure we have data or see empty/error state
    const hasData = await Cdat.checkState(this.components.tableRows.first(), LocatorState.Visible, 2000);
    const hasEmptyState = await Cdat.checkState(this.components.emptyState, LocatorState.Visible, 1000);
    const hasErrorState = await Cdat.checkState(this.components.errorState, LocatorState.Visible, 1000);

    if (!hasData && !hasEmptyState && !hasErrorState) {
      throw new Error('Grid did not load properly - no data, empty state, or error state found');
    }
  }

  /**
   * Performs a search in the grid
   */
  async search(options: GridSearchOptions): Promise<void> {
    if (options.query.length < 1) {
      throw new Error('Search query cannot be empty');
    }

    await Cdat.waitAndFill(this.components.searchInput, options.query);
    await Cdat.waitAndClick(this.components.searchButton);
    await this.waitForGridLoad();
  }

  /**
   * Clears the current search
   */
  async clearSearch(): Promise<void> {
    const hasClearButton = await Cdat.checkState(this.components.clearSearch, LocatorState.Visible, 1000);
    if (!hasClearButton) {
      return; // No search to clear
    }

    await Cdat.waitAndClick(this.components.clearSearch);
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

    await Cdat.waitAndClick(this.components.filterButton);
    await Cdat.waitForState(this.components.filterPanel, LocatorState.Visible);
  }

  /**
   * Applies a filter to a specific column
   */
  async applyFilter(options: GridFilterOptions): Promise<void> {
    await this.openFilterPanel();

    const filter = this.components.getColumnFilter(options.columnKey, options.filterType);

    switch (options.filterType) {
      case FilterType.TEXT:
        if (!options.value) {
          throw new Error('Text filter requires a value');
        }
        await Cdat.waitAndFill(filter, options.value);
        break;

      case FilterType.MULTISELECT:
        if (!options.value || !Array.isArray(options.value)) {
          throw new Error('Multiselect filter requires an array of values');
        }
        await Cdat.waitAndClick(filter);
        for (const value of options.value) {
          const option = this.components.getFilterOption(options.columnKey, value);
          await Cdat.waitAndClick(option);
        }
        break;

      case FilterType.DATE_RANGE:
        if (!options.dateRange) {
          throw new Error('Date range filter requires from and to dates');
        }
        const dateInputs = this.components.getDateRangeInputs(options.columnKey);
        await Cdat.waitAndFill(dateInputs.from, options.dateRange.from);
        await Cdat.waitAndFill(dateInputs.to, options.dateRange.to);
        break;

      case FilterType.SWITCH:
        await Cdat.waitAndClick(filter);
        break;

      default:
        throw new Error(`Unsupported filter type: ${options.filterType}`);
    }

    await Cdat.waitAndClick(this.components.filterApply);
    await this.waitForGridLoad();
  }

  /**
   * Clears a specific column filter
   */
  async clearColumnFilter(columnKey: string): Promise<void> {
    const clearButton = this.components.getColumnFilterClear(columnKey);
    const hasClearButton = await Cdat.checkState(clearButton, LocatorState.Visible, 1000);

    if (hasClearButton) {
      await Cdat.waitAndClick(clearButton);
      await this.waitForGridLoad();
    }
  }

  /**
   * Clears all active filters
   */
  async clearAllFilters(): Promise<void> {
    const hasActiveFilters = await Cdat.checkState(this.components.filterCount, LocatorState.Visible, 1000);
    if (!hasActiveFilters) {
      return; // No filters to clear
    }

    await this.openFilterPanel();
    await Cdat.waitAndClick(this.components.filterClear);
    await this.waitForGridLoad();
  }

  /**
   * Sorts a column
   */
  async sortColumn(options: GridSortOptions): Promise<void> {
    const sortButton = this.components.getSortButton(options.columnKey);
    await Cdat.waitAndClick(sortButton);

    // Check current sort direction and click again if needed for desc
    if (options.direction === 'desc') {
      const header = this.components.getHeaderCell(options.columnKey);
      const currentDirection = await header.getAttribute('data-sort-direction');
      if (currentDirection !== 'desc') {
        await Cdat.waitAndClick(sortButton);
      }
    }

    await this.waitForGridLoad();
  }

  /**
   * Changes the page size
   */
  async changePageSize(size: 10 | 25 | 50 | 100): Promise<void> {
    await Cdat.waitAndClick(this.components.pageSize);
    const option = this.components.getPageSizeOption(size);
    await Cdat.waitAndClick(option);
    await this.waitForGridLoad();
  }

  /**
   * Navigates to a specific page
   */
  async navigateToPage(pageNumber: number): Promise<void> {
    if (pageNumber === 1) {
      await Cdat.waitAndClick(this.components.firstPage);
    } else {
      // Try page input first
      const hasPageInput = await Cdat.checkState(this.components.pageInput, LocatorState.Visible, 1000);

      if (hasPageInput) {
        await Cdat.waitAndFill(this.components.pageInput, pageNumber.toString());
        await this.page.keyboard.press('Enter');
      } else {
        // Fallback: use navigation buttons
        await this.navigateToPageWithButtons(pageNumber);
      }
    }

    await this.waitForGridLoad();
  }

  /**
   * Helper method to navigate using next/previous buttons
   */
  private async navigateToPageWithButtons(targetPage: number): Promise<void> {
    const pageInfoText = await Cdat.waitForText(this.components.pageInfo);
    const currentPage = this.extractCurrentPageNumber(pageInfoText);

    if (currentPage === targetPage) {
      return;
    }

    const button = currentPage < targetPage ? this.components.nextPage : this.components.prevPage;
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
   * Selects specific rows by indices
   */
  async selectRows(rowIndices: number[]): Promise<void> {
    for (const index of rowIndices) {
      const checkbox = this.components.getRowCheckbox(index);
      await Cdat.waitAndClick(checkbox);
    }
  }

  /**
   * Selects all rows on current page
   */
  async selectAllRows(): Promise<void> {
    await Cdat.waitAndClick(this.components.selectAll);
  }

  /**
   * Gets the count of selected rows
   */
  async getSelectedRowCount(): Promise<number> {
    const selectionText = await Cdat.waitForText(this.components.selectionCount);
    const match = selectionText.match(/(\d+) selected/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Performs a bulk operation on selected rows
   */
  async performBulkOperation(options: BulkOperationOptions): Promise<void> {
    const selectedCount = await this.getSelectedRowCount();
    if (selectedCount === 0 && !options.selectAll) {
      throw new Error('No rows selected for bulk operation');
    }

    // Select rows if specified
    if (options.selectedRows && options.selectedRows.length > 0) {
      await this.selectRows(options.selectedRows);
    }

    if (options.selectAll) {
      await this.selectAllRows();
    }

    // Open bulk actions and perform operation
    const bulkAction = this.components.getBulkAction(options.actionName);
    await Cdat.waitAndClick(bulkAction);

    // Handle confirmation if required
    if (options.requiresConfirmation) {
      await Cdat.waitForState(this.components.bulkConfirm, LocatorState.Visible);
      await Cdat.waitAndClick(this.components.bulkConfirm);
    }

    await this.waitForGridLoad();
  }

  /**
   * Cancels a bulk operation
   */
  async cancelBulkOperation(): Promise<void> {
    const isBulkPanelVisible = await Cdat.checkState(this.components.bulkPanel, LocatorState.Visible, 1000);
    if (!isBulkPanelVisible) {
      return; // No bulk operation to cancel
    }

    await Cdat.waitAndClick(this.components.bulkCancel);
  }

  /**
   * Exports grid data
   */
  async exportData(format: 'csv' | 'excel' | 'pdf' = 'csv'): Promise<void> {
    await Cdat.waitAndClick(this.components.exportButton);
    const exportOption = this.components.getExportOption(format);
    await Cdat.waitAndClick(exportOption);

    // Wait for download to start (you might need to handle download differently based on your app)
    await this.page.waitForTimeout(2000);
  }

  /**
   * Refreshes the grid data
   */
  async refreshGrid(): Promise<void> {
    await Cdat.waitAndClick(this.components.refreshButton);
    await this.waitForGridLoad();
  }

  /**
   * Opens column management panel
   */
  async openColumnPanel(): Promise<void> {
    await Cdat.waitAndClick(this.components.columnsButton);
    await Cdat.waitForState(this.components.getColumnToggle(''), LocatorState.Visible);
  }

  /**
   * Toggles column visibility
   */
  async toggleColumn(columnKey: string, visible: boolean): Promise<void> {
    await this.openColumnPanel();
    const toggle = this.components.getColumnToggle(columnKey);
    const isCurrentlyVisible = await toggle.isChecked();

    if (isCurrentlyVisible !== visible) {
      await Cdat.waitAndClick(toggle);
    }
  }

  /**
   * Gets the total number of rows
   */
  async getTotalRowCount(): Promise<number> {
    const pageInfoText = await Cdat.waitForText(this.components.pageInfo);
    const match = pageInfoText.match(/of (\d+) total/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Gets the number of rows on current page
   */
  async getCurrentPageRowCount(): Promise<number> {
    return await this.components.tableRows.count();
  }

  /**
   * Checks if a specific row exists
   */
  async rowExists(text: string): Promise<boolean> {
    return await Cdat.checkState(this.components.getRowByText(text), LocatorState.Visible, 2000);
  }

  /**
   * Gets cell value by row and column
   */
  async getCellValue(rowIndex: number, columnKey: string): Promise<string> {
    const cell = this.components.getCell(rowIndex, columnKey);
    return await Cdat.waitForText(cell);
  }

  /**
   * Opens row actions menu
   */
  async openRowActions(rowIndex: number): Promise<void> {
    const actionsButton = this.components.getRowActions(rowIndex);
    await Cdat.waitAndClick(actionsButton);
    await Cdat.waitForState(
      this.components.getRow(rowIndex).locator('[data-testid="row-menu"]'),
      LocatorState.Visible
    );
  }

  /**
   * Waits for success message
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
   * Waits for error message
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
   * Retries loading if error state is shown
   */
  async retryIfError(): Promise<void> {
    const hasErrorState = await Cdat.checkState(this.components.errorState, LocatorState.Visible, 1000);
    if (hasErrorState) {
      await Cdat.waitAndClick(this.components.retryButton);
      await this.waitForGridLoad();
    }
  }
}