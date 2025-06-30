/**
 * CDAT Pattern - Global Components
 * @description Common UI components that appear across multiple features
 * Based on production analysis - separation of concerns pattern
 */

import type { Locator, Page } from '@playwright/test';

/**
 * Global Components class for shared application elements
 * Provides locators for common UI components that appear across features
 *
 * Use this pattern for elements like:
 * - Navigation bars, headers, footers
 * - Modal dialogs and overlays
 * - Loading indicators and spinners
 * - Toast notifications
 * - Tooltips and popovers
 *
 * @example
 * ```typescript
 * export class LoginActions {
 *   private globalComponents: GlobalComponents;
 *
 *   constructor(private page: Page) {
 *     this.globalComponents = new GlobalComponents(page);
 *   }
 *
 *   async waitForPageLoad() {
 *     await this.globalComponents.waitForLoadersToDisappear();
 *   }
 * }
 * ```
 */
export class GlobalComponents {
  // ─────────────────────────────────────────────────────────────────
  // LOADER SELECTORS
  // ─────────────────────────────────────────────────────────────────

  private readonly LOADER_SPINNER = '.spinner, .loading-spinner, [data-testid="spinner"]';
  private readonly PAGE_LOADER = '.page-loader, .app-loader, [data-testid="page-loader"]';
  private readonly CARD_LOADER = '.card-loader, .content-loader, [data-testid="card-loader"]';
  private readonly MODAL_LOADER = '.modal-loader, .dialog-loader, [data-testid="modal-loader"]';
  private readonly PROGRESS_BAR = 'progress, [role="progressbar"], .progress-bar';

  // ─────────────────────────────────────────────────────────────────
  // NAVIGATION SELECTORS
  // ─────────────────────────────────────────────────────────────────

  private readonly HEADER = 'header, .header, .app-header, [data-testid="header"]';
  private readonly FOOTER = 'footer, .footer, .app-footer, [data-testid="footer"]';
  private readonly MAIN_NAV = 'nav, .main-nav, .navigation, [data-testid="main-nav"]';
  private readonly BREADCRUMBS = '.breadcrumb, .breadcrumbs, [data-testid="breadcrumbs"]';

  // ─────────────────────────────────────────────────────────────────
  // MODAL AND OVERLAY SELECTORS
  // ─────────────────────────────────────────────────────────────────

  private readonly MODAL = '.modal, .dialog, [role="dialog"], [data-testid="modal"]';
  private readonly MODAL_BACKDROP = '.modal-backdrop, .overlay, .modal-overlay';
  private readonly MODAL_CLOSE = '.modal-close, .dialog-close, [aria-label*="close"], [data-testid="modal-close"]';

  // ─────────────────────────────────────────────────────────────────
  // NOTIFICATION SELECTORS
  // ─────────────────────────────────────────────────────────────────

  private readonly TOAST = '.toast, .notification, .alert, [role="alert"], [data-testid="toast"]';
  private readonly SUCCESS_MESSAGE = '.alert-success, .success, .toast-success, [data-testid="success-message"]';
  private readonly ERROR_MESSAGE = '.alert-error, .alert-danger, .error, .toast-error, [data-testid="error-message"]';
  private readonly WARNING_MESSAGE = '.alert-warning, .warning, .toast-warning, [data-testid="warning-message"]';

  // ─────────────────────────────────────────────────────────────────
  // TOOLTIP AND POPOVER SELECTORS
  // ─────────────────────────────────────────────────────────────────

  private readonly TOOLTIP = '[role="tooltip"], .tooltip, .popover, [data-testid="tooltip"]';
  private readonly TOOLTIP_CONTENT = '.tooltip-content, .popover-content, [data-testid="tooltip-content"]';

  // ─────────────────────────────────────────────────────────────────
  // FORM AND INPUT SELECTORS
  // ─────────────────────────────────────────────────────────────────

  private readonly VALIDATION_ERROR = '.form-error, .field-error, .invalid-feedback, [data-testid="field-error"]';
  private readonly REQUIRED_FIELD_INDICATOR = '.required, [aria-required="true"], [data-required="true"]';

  constructor(private page: Page) {}

  // ─────────────────────────────────────────────────────────────────
  // LOADER GETTERS
  // ─────────────────────────────────────────────────────────────────

  /** General spinner/loading indicator */
  get spinner(): Locator {
    return this.page.locator(this.LOADER_SPINNER);
  }

  /** Page-level loading indicator */
  get pageLoader(): Locator {
    return this.page.locator(this.PAGE_LOADER);
  }

  /** Card/component-level loading indicator */
  get cardLoader(): Locator {
    return this.page.locator(this.CARD_LOADER);
  }

  /** Modal dialog loading indicator */
  get modalLoader(): Locator {
    return this.page.locator(this.MODAL_LOADER);
  }

  /** Progress bar element */
  get progressBar(): Locator {
    return this.page.locator(this.PROGRESS_BAR);
  }

  // ─────────────────────────────────────────────────────────────────
  // NAVIGATION GETTERS
  // ─────────────────────────────────────────────────────────────────

  /** Main application header */
  get header(): Locator {
    return this.page.locator(this.HEADER);
  }

  /** Main application footer */
  get footer(): Locator {
    return this.page.locator(this.FOOTER);
  }

  /** Primary navigation */
  get mainNavigation(): Locator {
    return this.page.locator(this.MAIN_NAV);
  }

  /** Breadcrumb navigation */
  get breadcrumbs(): Locator {
    return this.page.locator(this.BREADCRUMBS);
  }

  // ─────────────────────────────────────────────────────────────────
  // MODAL AND OVERLAY GETTERS
  // ─────────────────────────────────────────────────────────────────

  /** Modal dialog */
  get modal(): Locator {
    return this.page.locator(this.MODAL);
  }

  /** Modal backdrop/overlay */
  get modalBackdrop(): Locator {
    return this.page.locator(this.MODAL_BACKDROP);
  }

  /** Modal close button */
  get modalClose(): Locator {
    return this.page.locator(this.MODAL_CLOSE);
  }

  // ─────────────────────────────────────────────────────────────────
  // NOTIFICATION GETTERS
  // ─────────────────────────────────────────────────────────────────

  /** Generic toast/notification */
  get toast(): Locator {
    return this.page.locator(this.TOAST);
  }

  /** Success notification */
  get successMessage(): Locator {
    return this.page.locator(this.SUCCESS_MESSAGE);
  }

  /** Error notification */
  get errorMessage(): Locator {
    return this.page.locator(this.ERROR_MESSAGE);
  }

  /** Warning notification */
  get warningMessage(): Locator {
    return this.page.locator(this.WARNING_MESSAGE);
  }

  // ─────────────────────────────────────────────────────────────────
  // TOOLTIP AND POPOVER GETTERS
  // ─────────────────────────────────────────────────────────────────

  /** Tooltip element */
  get tooltip(): Locator {
    return this.page.locator(this.TOOLTIP);
  }

  /** Tooltip content */
  get tooltipContent(): Locator {
    return this.page.locator(this.TOOLTIP_CONTENT);
  }

  // ─────────────────────────────────────────────────────────────────
  // FORM AND VALIDATION GETTERS
  // ─────────────────────────────────────────────────────────────────

  /** Validation error messages */
  get validationErrors(): Locator {
    return this.page.locator(this.VALIDATION_ERROR);
  }

  /** Required field indicators */
  get requiredFieldIndicators(): Locator {
    return this.page.locator(this.REQUIRED_FIELD_INDICATOR);
  }

  // ─────────────────────────────────────────────────────────────────
  // UTILITY METHODS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Wait for all loaders to disappear
   * Useful for page load verification
   *
   * @param timeout - Maximum wait time
   *
   * @example
   * ```typescript
   * await globalComponents.waitForLoadersToDisappear();
   * ```
   */
  async waitForLoadersToDisappear(timeout: number = 10000): Promise<void> {
    const loaders = [
      this.spinner,
      this.pageLoader,
      this.cardLoader,
      this.modalLoader,
      this.progressBar
    ];

    await Promise.allSettled(
      loaders.map(loader =>
        loader.waitFor({ state: 'hidden', timeout }).catch(() => {
          // Ignore if loader doesn't exist
        })
      )
    );
  }

  /**
   * Get tooltip text content
   * Waits for tooltip to be visible and returns its text
   *
   * @param timeout - Maximum wait time
   * @returns Tooltip text content
   *
   * @example
   * ```typescript
   * const tooltipText = await globalComponents.getTooltipText();
   * ```
   */
  async getTooltipText(timeout: number = 5000): Promise<string> {
    await this.tooltip.waitFor({ state: 'visible', timeout });
    const content = await this.tooltipContent.textContent();

    if (!content) {
      throw new Error('Tooltip text not found');
    }

    return content.trim();
  }

  /**
   * Close modal dialog
   * Attempts to close modal using close button or ESC key
   *
   * @param useEscKey - Whether to use ESC key instead of close button
   *
   * @example
   * ```typescript
   * await globalComponents.closeModal();
   * await globalComponents.closeModal(true); // Use ESC key
   * ```
   */
  async closeModal(useEscKey: boolean = false): Promise<void> {
    if (useEscKey) {
      await this.page.keyboard.press('Escape');
      await this.modal.waitFor({ state: 'hidden', timeout: 5000 });
      return;
    }

    await this.modalClose.click();
    await this.modal.waitFor({ state: 'hidden', timeout: 5000 });
  }

  /**
   * Wait for success message to appear
   * Useful for form submission verification
   *
   * @param timeout - Maximum wait time
   * @returns Success message text
   *
   * @example
   * ```typescript
   * const message = await globalComponents.waitForSuccessMessage();
   * ```
   */
  async waitForSuccessMessage(timeout: number = 5000): Promise<string> {
    await this.successMessage.waitFor({ state: 'visible', timeout });
    const text = await this.successMessage.textContent();
    return text?.trim() || '';
  }

  /**
   * Wait for error message to appear
   * Useful for form validation verification
   *
   * @param timeout - Maximum wait time
   * @returns Error message text
   *
   * @example
   * ```typescript
   * const error = await globalComponents.waitForErrorMessage();
   * ```
   */
  async waitForErrorMessage(timeout: number = 5000): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout });
    const text = await this.errorMessage.textContent();
    return text?.trim() || '';
  }

  /**
   * Check if modal is open
   * Non-throwing check for modal visibility
   *
   * @param timeout - Maximum wait time
   * @returns True if modal is visible
   *
   * @example
   * ```typescript
   * if (await globalComponents.isModalOpen()) {
   *   await globalComponents.closeModal();
   * }
   * ```
   */
  async isModalOpen(timeout: number = 1000): Promise<boolean> {
    try {
      await this.modal.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }
}