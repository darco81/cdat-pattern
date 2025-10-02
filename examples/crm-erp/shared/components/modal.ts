/**
 * ModalComponents - Reusable modal dialog component locators
 *
 * Extracted from production CRM/ERP patterns
 * Features: Confirmation dialogs, form modals, info dialogs
 * Used across: Delete confirmations, bulk operations, form dialogs
 */

import { Locator, Page } from '@playwright/test';

export enum ModalType {
  Confirmation = 'confirmation',
  Form = 'form',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Success = 'success',
}

export class ModalComponents {
  // Modal container elements
  private readonly MODAL_OVERLAY = '[data-testid="modal-overlay"]';
  private readonly MODAL_CONTAINER = '[data-testid="modal"]';
  private readonly MODAL_HEADER = '[data-testid="modal-header"]';
  private readonly MODAL_TITLE = '[data-testid="modal-title"]';
  private readonly MODAL_SUBTITLE = '[data-testid="modal-subtitle"]';
  private readonly MODAL_CLOSE = '[data-testid="modal-close"]';

  // Modal body elements
  private readonly MODAL_BODY = '[data-testid="modal-body"]';
  private readonly MODAL_CONTENT = '[data-testid="modal-content"]';
  private readonly MODAL_MESSAGE = '[data-testid="modal-message"]';
  private readonly MODAL_DESCRIPTION = '[data-testid="modal-description"]';
  private readonly MODAL_ICON = '[data-testid="modal-icon"]';

  // Modal footer elements
  private readonly MODAL_FOOTER = '[data-testid="modal-footer"]';
  private readonly MODAL_ACTIONS = '[data-testid="modal-actions"]';

  // Standard action buttons
  private readonly PRIMARY_BUTTON = '[data-testid="modal-primary"]';
  private readonly SECONDARY_BUTTON = '[data-testid="modal-secondary"]';
  private readonly CANCEL_BUTTON = '[data-testid="modal-cancel"]';
  private readonly CLOSE_BUTTON = '[data-testid="modal-close-button"]';

  // Specific action buttons
  private readonly CONFIRM_BUTTON = '[data-testid="modal-confirm"]';
  private readonly DELETE_BUTTON = '[data-testid="modal-delete"]';
  private readonly SAVE_BUTTON = '[data-testid="modal-save"]';
  private readonly SUBMIT_BUTTON = '[data-testid="modal-submit"]';
  private readonly OK_BUTTON = '[data-testid="modal-ok"]';
  private readonly YES_BUTTON = '[data-testid="modal-yes"]';
  private readonly NO_BUTTON = '[data-testid="modal-no"]';

  // Form elements (when modal contains forms)
  private readonly MODAL_FORM = '[data-testid="modal-form"]';
  private readonly FORM_FIELD = '[data-testid="form-field"]';
  private readonly FORM_INPUT = '[data-testid="form-input"]';
  private readonly FORM_SELECT = '[data-testid="form-select"]';
  private readonly FORM_TEXTAREA = '[data-testid="form-textarea"]';
  private readonly FORM_CHECKBOX = '[data-testid="form-checkbox"]';
  private readonly FORM_ERROR = '[data-testid="form-error"]';

  // Loading and state elements
  private readonly LOADING_SPINNER = '[data-testid="modal-loading"]';
  private readonly PROGRESS_BAR = '[data-testid="modal-progress"]';
  private readonly SUCCESS_ICON = '[data-testid="success-icon"]';
  private readonly ERROR_ICON = '[data-testid="error-icon"]';
  private readonly WARNING_ICON = '[data-testid="warning-icon"]';
  private readonly INFO_ICON = '[data-testid="info-icon"]';

  // Special modals
  private readonly CONFIRMATION_MODAL = '[data-testid="confirmation-modal"]';
  private readonly DELETE_CONFIRMATION = '[data-testid="delete-confirmation"]';
  private readonly UNSAVED_CHANGES = '[data-testid="unsaved-changes-modal"]';
  private readonly BULK_ACTION_MODAL = '[data-testid="bulk-action-modal"]';

  // Multi-step modal elements
  private readonly STEP_INDICATOR = '[data-testid="modal-steps"]';
  private readonly STEP_ITEM = '[data-testid="step-item"]';
  private readonly STEP_NUMBER = '[data-testid="step-number"]';
  private readonly STEP_TITLE = '[data-testid="step-title"]';
  private readonly STEP_CONTENT = '[data-testid="step-content"]';
  private readonly PREV_STEP_BUTTON = '[data-testid="prev-step"]';
  private readonly NEXT_STEP_BUTTON = '[data-testid="next-step"]';

  constructor(private page: Page) {}

  // Basic modal getters
  get modalOverlay(): Locator {
    return this.page.locator(this.MODAL_OVERLAY);
  }

  get modalContainer(): Locator {
    return this.page.locator(this.MODAL_CONTAINER);
  }

  get modalHeader(): Locator {
    return this.page.locator(this.MODAL_HEADER);
  }

  get modalTitle(): Locator {
    return this.page.locator(this.MODAL_TITLE);
  }

  get modalSubtitle(): Locator {
    return this.page.locator(this.MODAL_SUBTITLE);
  }

  get modalClose(): Locator {
    return this.page.locator(this.MODAL_CLOSE);
  }

  get modalBody(): Locator {
    return this.page.locator(this.MODAL_BODY);
  }

  get modalContent(): Locator {
    return this.page.locator(this.MODAL_CONTENT);
  }

  get modalMessage(): Locator {
    return this.page.locator(this.MODAL_MESSAGE);
  }

  get modalDescription(): Locator {
    return this.page.locator(this.MODAL_DESCRIPTION);
  }

  get modalIcon(): Locator {
    return this.page.locator(this.MODAL_ICON);
  }

  get modalFooter(): Locator {
    return this.page.locator(this.MODAL_FOOTER);
  }

  get modalActions(): Locator {
    return this.page.locator(this.MODAL_ACTIONS);
  }

  // Action button getters
  get primaryButton(): Locator {
    return this.page.locator(this.PRIMARY_BUTTON);
  }

  get secondaryButton(): Locator {
    return this.page.locator(this.SECONDARY_BUTTON);
  }

  get cancelButton(): Locator {
    return this.page.locator(this.CANCEL_BUTTON);
  }

  get closeButton(): Locator {
    return this.page.locator(this.CLOSE_BUTTON);
  }

  get confirmButton(): Locator {
    return this.page.locator(this.CONFIRM_BUTTON);
  }

  get deleteButton(): Locator {
    return this.page.locator(this.DELETE_BUTTON);
  }

  get saveButton(): Locator {
    return this.page.locator(this.SAVE_BUTTON);
  }

  get submitButton(): Locator {
    return this.page.locator(this.SUBMIT_BUTTON);
  }

  get okButton(): Locator {
    return this.page.locator(this.OK_BUTTON);
  }

  get yesButton(): Locator {
    return this.page.locator(this.YES_BUTTON);
  }

  get noButton(): Locator {
    return this.page.locator(this.NO_BUTTON);
  }

  // Form element getters
  get modalForm(): Locator {
    return this.page.locator(this.MODAL_FORM);
  }

  get formFields(): Locator {
    return this.page.locator(this.FORM_FIELD);
  }

  get formError(): Locator {
    return this.page.locator(this.FORM_ERROR);
  }

  // State element getters
  get loadingSpinner(): Locator {
    return this.page.locator(this.LOADING_SPINNER);
  }

  get progressBar(): Locator {
    return this.page.locator(this.PROGRESS_BAR);
  }

  get successIcon(): Locator {
    return this.page.locator(this.SUCCESS_ICON);
  }

  get errorIcon(): Locator {
    return this.page.locator(this.ERROR_ICON);
  }

  get warningIcon(): Locator {
    return this.page.locator(this.WARNING_ICON);
  }

  get infoIcon(): Locator {
    return this.page.locator(this.INFO_ICON);
  }

  // Special modal getters
  get confirmationModal(): Locator {
    return this.page.locator(this.CONFIRMATION_MODAL);
  }

  get deleteConfirmation(): Locator {
    return this.page.locator(this.DELETE_CONFIRMATION);
  }

  get unsavedChangesModal(): Locator {
    return this.page.locator(this.UNSAVED_CHANGES);
  }

  get bulkActionModal(): Locator {
    return this.page.locator(this.BULK_ACTION_MODAL);
  }

  // Multi-step modal getters
  get stepIndicator(): Locator {
    return this.page.locator(this.STEP_INDICATOR);
  }

  get stepItems(): Locator {
    return this.page.locator(this.STEP_ITEM);
  }

  get stepContent(): Locator {
    return this.page.locator(this.STEP_CONTENT);
  }

  get prevStepButton(): Locator {
    return this.page.locator(this.PREV_STEP_BUTTON);
  }

  get nextStepButton(): Locator {
    return this.page.locator(this.NEXT_STEP_BUTTON);
  }

  // Dynamic getters

  /**
   * Gets modal by specific type
   */
  getModalByType(type: ModalType): Locator {
    return this.page.locator(`${this.MODAL_CONTAINER}[data-modal-type="${type}"]`);
  }

  /**
   * Gets form input by field name
   */
  getFormInput(fieldName: string): Locator {
    return this.page.locator(`${this.FORM_INPUT}[data-field="${fieldName}"]`);
  }

  /**
   * Gets form select by field name
   */
  getFormSelect(fieldName: string): Locator {
    return this.page.locator(`${this.FORM_SELECT}[data-field="${fieldName}"]`);
  }

  /**
   * Gets form textarea by field name
   */
  getFormTextarea(fieldName: string): Locator {
    return this.page.locator(`${this.FORM_TEXTAREA}[data-field="${fieldName}"]`);
  }

  /**
   * Gets form checkbox by field name
   */
  getFormCheckbox(fieldName: string): Locator {
    return this.page.locator(`${this.FORM_CHECKBOX}[data-field="${fieldName}"]`);
  }

  /**
   * Gets form field error by field name
   */
  getFieldError(fieldName: string): Locator {
    return this.page.locator(`${this.FORM_ERROR}[data-field="${fieldName}"]`);
  }

  /**
   * Gets step by step number
   */
  getStep(stepNumber: number): Locator {
    return this.page.locator(`${this.STEP_ITEM}[data-step="${stepNumber}"]`);
  }

  /**
   * Gets step title by step number
   */
  getStepTitle(stepNumber: number): Locator {
    return this.getStep(stepNumber).locator(this.STEP_TITLE);
  }

  /**
   * Gets modal by title text
   */
  getModalByTitle(titleText: string): Locator {
    return this.page.locator(`${this.MODAL_CONTAINER}:has(${this.MODAL_TITLE}:has-text("${titleText}"))`);
  }

  /**
   * Gets action button by text
   */
  getActionButton(buttonText: string): Locator {
    return this.modalActions.locator(`button:has-text("${buttonText}")`);
  }

  /**
   * Gets modal with specific data attribute
   */
  getModalByData(dataAttribute: string, value: string): Locator {
    return this.page.locator(`${this.MODAL_CONTAINER}[data-${dataAttribute}="${value}"]`);
  }

  /**
   * Gets icon by icon type
   */
  getIconByType(iconType: 'success' | 'error' | 'warning' | 'info'): Locator {
    const iconMap = {
      success: this.successIcon,
      error: this.errorIcon,
      warning: this.warningIcon,
      info: this.infoIcon,
    };
    return iconMap[iconType];
  }

  /**
   * Gets form validation summary
   */
  getValidationSummary(): Locator {
    return this.page.locator('[data-testid="validation-summary"]');
  }

  /**
   * Gets progress percentage
   */
  getProgressPercentage(): Locator {
    return this.page.locator('[data-testid="progress-percentage"]');
  }
}