/**
 * DataGridComponents - Reusable data grid component locators
 *
 * Extracted from production CRM/ERP patterns
 * Features: Advanced filtering, sorting, pagination, bulk operations
 * Used across: Users, Documents, Reports, Entities
 */

import { Locator, Page } from '@playwright/test';
import { FilterType } from '../../utils/types';

export class DataGridComponents {
  // Main grid container
  private readonly GRID_CONTAINER = '[data-testid="data-grid"]';
  private readonly GRID_HEADER = '[data-testid="grid-header"]';
  private readonly GRID_BODY = '[data-testid="grid-body"]';
  private readonly GRID_FOOTER = '[data-testid="grid-footer"]';

  // Loading and empty states
  private readonly LOADING_OVERLAY = '[data-testid="grid-loading"]';
  private readonly EMPTY_STATE = '[data-testid="grid-empty"]';
  private readonly ERROR_STATE = '[data-testid="grid-error"]';
  private readonly RETRY_BUTTON = '[data-testid="retry-button"]';

  // Toolbar elements
  private readonly TOOLBAR = '[data-testid="grid-toolbar"]';
  private readonly SEARCH_INPUT = '[data-testid="grid-search"]';
  private readonly SEARCH_BUTTON = '[data-testid="search-button"]';
  private readonly CLEAR_SEARCH = '[data-testid="clear-search"]';
  private readonly FILTER_BUTTON = '[data-testid="filter-button"]';
  private readonly FILTER_COUNT = '[data-testid="active-filter-count"]';
  private readonly EXPORT_BUTTON = '[data-testid="export-button"]';
  private readonly REFRESH_BUTTON = '[data-testid="refresh-button"]';
  private readonly COLUMNS_BUTTON = '[data-testid="columns-button"]';

  // Filter panel
  private readonly FILTER_PANEL = '[data-testid="filter-panel"]';
  private readonly FILTER_CLOSE = '[data-testid="filter-close"]';
  private readonly FILTER_APPLY = '[data-testid="filter-apply"]';
  private readonly FILTER_CLEAR = '[data-testid="filter-clear"]';
  private readonly FILTER_RESET = '[data-testid="filter-reset"]';

  // Column management
  private readonly COLUMN_PANEL = '[data-testid="column-panel"]';
  private readonly COLUMN_ITEM = '[data-testid="column-item"]';
  private readonly COLUMN_TOGGLE = '[data-testid="column-toggle"]';
  private readonly COLUMN_REORDER = '[data-testid="column-reorder"]';

  // Table elements
  private readonly TABLE = '[data-testid="grid-table"]';
  private readonly TABLE_HEAD = '[data-testid="table-head"]';
  private readonly TABLE_BODY = '[data-testid="table-body"]';
  private readonly TABLE_ROW = '[data-testid="table-row"]';
  private readonly TABLE_CELL = '[data-testid="table-cell"]';
  private readonly HEADER_CELL = '[data-testid="header-cell"]';

  // Selection elements
  private readonly SELECT_ALL = '[data-testid="select-all"]';
  private readonly SELECT_ROW = '[data-testid="select-row"]';
  private readonly SELECTION_COUNT = '[data-testid="selection-count"]';
  private readonly SELECTION_ACTIONS = '[data-testid="selection-actions"]';

  // Bulk operation elements
  private readonly BULK_PANEL = '[data-testid="bulk-panel"]';
  private readonly BULK_ACTION = '[data-testid="bulk-action"]';
  private readonly BULK_CONFIRM = '[data-testid="bulk-confirm"]';
  private readonly BULK_CANCEL = '[data-testid="bulk-cancel"]';

  // Row action elements
  private readonly ROW_ACTIONS = '[data-testid="row-actions"]';
  private readonly ROW_MENU = '[data-testid="row-menu"]';
  private readonly ROW_EDIT = '[data-testid="row-edit"]';
  private readonly ROW_DELETE = '[data-testid="row-delete"]';
  private readonly ROW_DUPLICATE = '[data-testid="row-duplicate"]';

  // Sorting elements
  private readonly SORT_BUTTON = '[data-testid="sort-button"]';
  private readonly SORT_ASC = '[data-testid="sort-asc"]';
  private readonly SORT_DESC = '[data-testid="sort-desc"]';
  private readonly SORT_CLEAR = '[data-testid="sort-clear"]';

  // Pagination elements
  private readonly PAGINATION = '[data-testid="pagination"]';
  private readonly PAGE_SIZE = '[data-testid="page-size"]';
  private readonly PAGE_INFO = '[data-testid="page-info"]';
  private readonly FIRST_PAGE = '[data-testid="first-page"]';
  private readonly PREV_PAGE = '[data-testid="prev-page"]';
  private readonly NEXT_PAGE = '[data-testid="next-page"]';
  private readonly LAST_PAGE = '[data-testid="last-page"]';
  private readonly PAGE_INPUT = '[data-testid="page-input"]';
  private readonly GOTO_PAGE = '[data-testid="goto-page"]';

  // Filter type specific elements
  private readonly TEXT_FILTER = '[data-testid="text-filter"]';
  private readonly SELECT_FILTER = '[data-testid="select-filter"]';
  private readonly MULTISELECT_FILTER = '[data-testid="multiselect-filter"]';
  private readonly DATE_FILTER = '[data-testid="date-filter"]';
  private readonly DATE_FROM = '[data-testid="date-from"]';
  private readonly DATE_TO = '[data-testid="date-to"]';
  private readonly NUMBER_FILTER = '[data-testid="number-filter"]';
  private readonly BOOLEAN_FILTER = '[data-testid="boolean-filter"]';

  constructor(private page: Page) {}

  // Main grid getters
  get gridContainer(): Locator {
    return this.page.locator(this.GRID_CONTAINER);
  }

  get gridHeader(): Locator {
    return this.page.locator(this.GRID_HEADER);
  }

  get gridBody(): Locator {
    return this.page.locator(this.GRID_BODY);
  }

  get gridFooter(): Locator {
    return this.page.locator(this.GRID_FOOTER);
  }

  // State getters
  get loadingOverlay(): Locator {
    return this.page.locator(this.LOADING_OVERLAY);
  }

  get emptyState(): Locator {
    return this.page.locator(this.EMPTY_STATE);
  }

  get errorState(): Locator {
    return this.page.locator(this.ERROR_STATE);
  }

  get retryButton(): Locator {
    return this.page.locator(this.RETRY_BUTTON);
  }

  // Toolbar getters
  get toolbar(): Locator {
    return this.page.locator(this.TOOLBAR);
  }

  get searchInput(): Locator {
    return this.page.locator(this.SEARCH_INPUT);
  }

  get searchButton(): Locator {
    return this.page.locator(this.SEARCH_BUTTON);
  }

  get clearSearch(): Locator {
    return this.page.locator(this.CLEAR_SEARCH);
  }

  get filterButton(): Locator {
    return this.page.locator(this.FILTER_BUTTON);
  }

  get filterCount(): Locator {
    return this.page.locator(this.FILTER_COUNT);
  }

  get exportButton(): Locator {
    return this.page.locator(this.EXPORT_BUTTON);
  }

  get refreshButton(): Locator {
    return this.page.locator(this.REFRESH_BUTTON);
  }

  get columnsButton(): Locator {
    return this.page.locator(this.COLUMNS_BUTTON);
  }

  // Filter panel getters
  get filterPanel(): Locator {
    return this.page.locator(this.FILTER_PANEL);
  }

  get filterClose(): Locator {
    return this.page.locator(this.FILTER_CLOSE);
  }

  get filterApply(): Locator {
    return this.page.locator(this.FILTER_APPLY);
  }

  get filterClear(): Locator {
    return this.page.locator(this.FILTER_CLEAR);
  }

  get filterReset(): Locator {
    return this.page.locator(this.FILTER_RESET);
  }

  // Table getters
  get table(): Locator {
    return this.page.locator(this.TABLE);
  }

  get tableHead(): Locator {
    return this.page.locator(this.TABLE_HEAD);
  }

  get tableBody(): Locator {
    return this.page.locator(this.TABLE_BODY);
  }

  get tableRows(): Locator {
    return this.page.locator(this.TABLE_ROW);
  }

  get selectAll(): Locator {
    return this.page.locator(this.SELECT_ALL);
  }

  get selectionCount(): Locator {
    return this.page.locator(this.SELECTION_COUNT);
  }

  get selectionActions(): Locator {
    return this.page.locator(this.SELECTION_ACTIONS);
  }

  // Pagination getters
  get pagination(): Locator {
    return this.page.locator(this.PAGINATION);
  }

  get pageSize(): Locator {
    return this.page.locator(this.PAGE_SIZE);
  }

  get pageInfo(): Locator {
    return this.page.locator(this.PAGE_INFO);
  }

  get firstPage(): Locator {
    return this.page.locator(this.FIRST_PAGE);
  }

  get prevPage(): Locator {
    return this.page.locator(this.PREV_PAGE);
  }

  get nextPage(): Locator {
    return this.page.locator(this.NEXT_PAGE);
  }

  get lastPage(): Locator {
    return this.page.locator(this.LAST_PAGE);
  }

  get pageInput(): Locator {
    return this.page.locator(this.PAGE_INPUT);
  }

  // Dynamic getters

  /**
   * Gets a specific table row by index
   */
  getRow(index: number): Locator {
    return this.tableRows.nth(index);
  }

  /**
   * Gets a row by unique identifier
   */
  getRowById(id: string): Locator {
    return this.page.locator(`${this.TABLE_ROW}[data-row-id="${id}"]`);
  }

  /**
   * Gets a specific cell by row and column
   */
  getCell(rowIndex: number, columnKey: string): Locator {
    return this.getRow(rowIndex).locator(`${this.TABLE_CELL}[data-column="${columnKey}"]`);
  }

  /**
   * Gets a header cell by column key
   */
  getHeaderCell(columnKey: string): Locator {
    return this.page.locator(`${this.HEADER_CELL}[data-column="${columnKey}"]`);
  }

  /**
   * Gets a column filter by column key and filter type
   */
  getColumnFilter(columnKey: string, filterType: FilterType): Locator {
    const filterTypeMap = {
      [FilterType.TEXT]: this.TEXT_FILTER,
      [FilterType.MULTISELECT]: this.MULTISELECT_FILTER,
      [FilterType.DATE_RANGE]: this.DATE_FILTER,
      [FilterType.NUMERIC_RANGE]: this.NUMBER_FILTER,
      [FilterType.SWITCH]: this.BOOLEAN_FILTER,
      [FilterType.DOTTED_STATUS]: this.SELECT_FILTER,
    };

    return this.page.locator(`[data-column="${columnKey}"] ${filterTypeMap[filterType]}`);
  }

  /**
   * Gets filter input for date range
   */
  getDateRangeInputs(columnKey: string): { from: Locator; to: Locator } {
    const filterContainer = this.page.locator(`[data-column="${columnKey}"] ${this.DATE_FILTER}`);
    return {
      from: filterContainer.locator(this.DATE_FROM),
      to: filterContainer.locator(this.DATE_TO),
    };
  }

  /**
   * Gets sort button for a specific column
   */
  getSortButton(columnKey: string): Locator {
    return this.page.locator(`[data-column="${columnKey}"] ${this.SORT_BUTTON}`);
  }

  /**
   * Gets row checkbox for selection
   */
  getRowCheckbox(rowIndex: number): Locator {
    return this.getRow(rowIndex).locator(this.SELECT_ROW);
  }

  /**
   * Gets row actions menu
   */
  getRowActions(rowIndex: number): Locator {
    return this.getRow(rowIndex).locator(this.ROW_ACTIONS);
  }

  /**
   * Gets bulk action button by action name
   */
  getBulkAction(actionName: string): Locator {
    return this.page.locator(`${this.BULK_ACTION}[data-action="${actionName}"]`);
  }

  /**
   * Gets column toggle in column panel
   */
  getColumnToggle(columnKey: string): Locator {
    return this.page.locator(`${this.COLUMN_ITEM}[data-column="${columnKey}"] ${this.COLUMN_TOGGLE}`);
  }

  /**
   * Gets filter option in multiselect filter
   */
  getFilterOption(columnKey: string, optionValue: string): Locator {
    return this.page.locator(
      `[data-column="${columnKey}"] ${this.MULTISELECT_FILTER} [data-option="${optionValue}"]`
    );
  }

  /**
   * Gets page size option
   */
  getPageSizeOption(size: number): Locator {
    return this.page.locator(`[data-testid="page-size-option-${size}"]`);
  }

  /**
   * Gets export format option
   */
  getExportOption(format: string): Locator {
    return this.page.locator(`[data-testid="export-option-${format}"]`);
  }

  /**
   * Gets row containing specific text
   */
  getRowByText(text: string): Locator {
    return this.page.locator(`${this.TABLE_ROW}:has-text("${text}")`);
  }

  /**
   * Gets all selected rows
   */
  getSelectedRows(): Locator {
    return this.page.locator(`${this.TABLE_ROW}:has([data-testid="select-row"]:checked)`);
  }

  /**
   * Gets column resize handle
   */
  getColumnResizeHandle(columnKey: string): Locator {
    return this.page.locator(`[data-column="${columnKey}"] [data-testid="resize-handle"]`);
  }

  /**
   * Gets filter clear button for specific column
   */
  getColumnFilterClear(columnKey: string): Locator {
    return this.page.locator(`[data-column="${columnKey}"] [data-testid="filter-clear"]`);
  }
}