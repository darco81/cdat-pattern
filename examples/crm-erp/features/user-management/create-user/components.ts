/**
 * CreateUserComponents - Locators for user creation form interface
 *
 * Extracted from production CRM/ERP patterns
 * Features: Multi-step form, conditional fields, validation, file upload
 */

import { Locator, Page } from '@playwright/test';

export class CreateUserComponents {
  // Form header selectors
  private readonly PAGE_TITLE = '[data-testid="create-user-title"]';
  private readonly BREADCRUMB = '[data-testid="breadcrumb"]';
  private readonly BACK_BUTTON = '[data-testid="back-button"]';

  // Form step indicators
  private readonly STEP_INDICATOR = '[data-testid="step-indicator"]';
  private readonly STEP_BASIC_INFO = '[data-testid="step-basic-info"]';
  private readonly STEP_ROLE_PERMISSIONS = '[data-testid="step-role-permissions"]';
  private readonly STEP_ADDITIONAL_INFO = '[data-testid="step-additional-info"]';
  private readonly STEP_CONFIRMATION = '[data-testid="step-confirmation"]';

  // Form container and sections
  private readonly CREATE_USER_FORM = '[data-testid="create-user-form"]';
  private readonly BASIC_INFO_SECTION = '[data-testid="basic-info-section"]';
  private readonly ROLE_PERMISSIONS_SECTION = '[data-testid="role-permissions-section"]';
  private readonly ADDITIONAL_INFO_SECTION = '[data-testid="additional-info-section"]';
  private readonly CONFIRMATION_SECTION = '[data-testid="confirmation-section"]';

  // Basic information fields
  private readonly EMAIL_INPUT = '[data-testid="email-input"]';
  private readonly FIRST_NAME_INPUT = '[data-testid="first-name-input"]';
  private readonly LAST_NAME_INPUT = '[data-testid="last-name-input"]';
  private readonly PHONE_INPUT = '[data-testid="phone-input"]';
  private readonly PASSWORD_INPUT = '[data-testid="password-input"]';
  private readonly CONFIRM_PASSWORD_INPUT = '[data-testid="confirm-password-input"]';
  private readonly GENERATE_PASSWORD_BUTTON = '[data-testid="generate-password-button"]';
  private readonly SHOW_PASSWORD_TOGGLE = '[data-testid="show-password-toggle"]';
  private readonly SEND_INVITE_CHECKBOX = '[data-testid="send-invite-checkbox"]';

  // Role and permissions fields
  private readonly ROLE_SELECT = '[data-testid="role-select"]';
  private readonly ROLE_OPTION = '[data-testid="role-option"]';
  private readonly ROLE_DESCRIPTION = '[data-testid="role-description"]';
  private readonly DEPARTMENT_SELECT = '[data-testid="department-select"]';
  private readonly DEPARTMENT_OPTION = '[data-testid="department-option"]';
  private readonly MANAGER_SELECT = '[data-testid="manager-select"]';
  private readonly MANAGER_OPTION = '[data-testid="manager-option"]';
  private readonly PERMISSIONS_LIST = '[data-testid="permissions-list"]';
  private readonly PERMISSION_ITEM = '[data-testid="permission-item"]';
  private readonly CUSTOM_PERMISSIONS_TOGGLE = '[data-testid="custom-permissions-toggle"]';
  private readonly CUSTOM_PERMISSIONS_PANEL = '[data-testid="custom-permissions-panel"]';

  // Additional information fields
  private readonly EMPLOYEE_ID_INPUT = '[data-testid="employee-id-input"]';
  private readonly START_DATE_INPUT = '[data-testid="start-date-input"]';
  private readonly OFFICE_LOCATION_SELECT = '[data-testid="office-location-select"]';
  private readonly WORK_TYPE_SELECT = '[data-testid="work-type-select"]';
  private readonly TIME_ZONE_SELECT = '[data-testid="time-zone-select"]';
  private readonly LANGUAGE_SELECT = '[data-testid="language-select"]';
  private readonly PROFILE_PICTURE_UPLOAD = '[data-testid="profile-picture-upload"]';
  private readonly PROFILE_PICTURE_PREVIEW = '[data-testid="profile-picture-preview"]';
  private readonly REMOVE_PICTURE_BUTTON = '[data-testid="remove-picture-button"]';

  // Address information fields
  private readonly ADDRESS_SECTION = '[data-testid="address-section"]';
  private readonly STREET_INPUT = '[data-testid="street-input"]';
  private readonly BUILDING_NUMBER_INPUT = '[data-testid="building-number-input"]';
  private readonly APARTMENT_NUMBER_INPUT = '[data-testid="apartment-number-input"]';
  private readonly POSTAL_CODE_INPUT = '[data-testid="postal-code-input"]';
  private readonly CITY_INPUT = '[data-testid="city-input"]';
  private readonly COUNTRY_SELECT = '[data-testid="country-select"]';
  private readonly STATE_PROVINCE_INPUT = '[data-testid="state-province-input"]';

  // Confirmation section
  private readonly USER_SUMMARY = '[data-testid="user-summary"]';
  private readonly SUMMARY_EMAIL = '[data-testid="summary-email"]';
  private readonly SUMMARY_NAME = '[data-testid="summary-name"]';
  private readonly SUMMARY_ROLE = '[data-testid="summary-role"]';
  private readonly SUMMARY_DEPARTMENT = '[data-testid="summary-department"]';
  private readonly SUMMARY_PERMISSIONS = '[data-testid="summary-permissions"]';
  private readonly EDIT_SECTION_BUTTON = '[data-testid="edit-section-button"]';

  // Form validation and error messages
  private readonly FORM_ERROR = '[data-testid="form-error"]';
  private readonly FIELD_ERROR = '[data-testid="field-error"]';
  private readonly EMAIL_ERROR = '[data-testid="email-error"]';
  private readonly FIRST_NAME_ERROR = '[data-testid="first-name-error"]';
  private readonly LAST_NAME_ERROR = '[data-testid="last-name-error"]';
  private readonly PASSWORD_ERROR = '[data-testid="password-error"]';
  private readonly CONFIRM_PASSWORD_ERROR = '[data-testid="confirm-password-error"]';
  private readonly ROLE_ERROR = '[data-testid="role-error"]';
  private readonly DEPARTMENT_ERROR = '[data-testid="department-error"]';

  // Password strength indicator
  private readonly PASSWORD_STRENGTH = '[data-testid="password-strength"]';
  private readonly STRENGTH_WEAK = '[data-testid="strength-weak"]';
  private readonly STRENGTH_MEDIUM = '[data-testid="strength-medium"]';
  private readonly STRENGTH_STRONG = '[data-testid="strength-strong"]';
  private readonly PASSWORD_REQUIREMENTS = '[data-testid="password-requirements"]';
  private readonly REQUIREMENT_ITEM = '[data-testid="requirement-item"]';

  // Form navigation buttons
  private readonly NEXT_BUTTON = '[data-testid="next-button"]';
  private readonly PREVIOUS_BUTTON = '[data-testid="previous-button"]';
  private readonly SAVE_DRAFT_BUTTON = '[data-testid="save-draft-button"]';
  private readonly SUBMIT_BUTTON = '[data-testid="submit-button"]';
  private readonly CANCEL_BUTTON = '[data-testid="cancel-button"]';

  // Success and loading states
  private readonly LOADING_SPINNER = '[data-testid="loading-spinner"]';
  private readonly SUCCESS_MESSAGE = '[data-testid="success-message"]';
  private readonly SUCCESS_ICON = '[data-testid="success-icon"]';
  private readonly VIEW_USER_BUTTON = '[data-testid="view-user-button"]';
  private readonly CREATE_ANOTHER_BUTTON = '[data-testid="create-another-button"]';

  // Modal dialogs
  private readonly UNSAVED_CHANGES_MODAL = '[data-testid="unsaved-changes-modal"]';
  private readonly DISCARD_CHANGES_BUTTON = '[data-testid="discard-changes-button"]';
  private readonly KEEP_EDITING_BUTTON = '[data-testid="keep-editing-button"]';
  private readonly DUPLICATE_EMAIL_MODAL = '[data-testid="duplicate-email-modal"]';

  constructor(private page: Page) {}

  // Form header getters
  get pageTitle(): Locator {
    return this.page.locator(this.PAGE_TITLE);
  }

  get breadcrumb(): Locator {
    return this.page.locator(this.BREADCRUMB);
  }

  get backButton(): Locator {
    return this.page.locator(this.BACK_BUTTON);
  }

  // Step indicator getters
  get stepIndicator(): Locator {
    return this.page.locator(this.STEP_INDICATOR);
  }

  get stepBasicInfo(): Locator {
    return this.page.locator(this.STEP_BASIC_INFO);
  }

  get stepRolePermissions(): Locator {
    return this.page.locator(this.STEP_ROLE_PERMISSIONS);
  }

  get stepAdditionalInfo(): Locator {
    return this.page.locator(this.STEP_ADDITIONAL_INFO);
  }

  get stepConfirmation(): Locator {
    return this.page.locator(this.STEP_CONFIRMATION);
  }

  // Form section getters
  get createUserForm(): Locator {
    return this.page.locator(this.CREATE_USER_FORM);
  }

  get basicInfoSection(): Locator {
    return this.page.locator(this.BASIC_INFO_SECTION);
  }

  get rolePermissionsSection(): Locator {
    return this.page.locator(this.ROLE_PERMISSIONS_SECTION);
  }

  get additionalInfoSection(): Locator {
    return this.page.locator(this.ADDITIONAL_INFO_SECTION);
  }

  get confirmationSection(): Locator {
    return this.page.locator(this.CONFIRMATION_SECTION);
  }

  // Basic information field getters
  get emailInput(): Locator {
    return this.page.locator(this.EMAIL_INPUT);
  }

  get firstNameInput(): Locator {
    return this.page.locator(this.FIRST_NAME_INPUT);
  }

  get lastNameInput(): Locator {
    return this.page.locator(this.LAST_NAME_INPUT);
  }

  get phoneInput(): Locator {
    return this.page.locator(this.PHONE_INPUT);
  }

  get passwordInput(): Locator {
    return this.page.locator(this.PASSWORD_INPUT);
  }

  get confirmPasswordInput(): Locator {
    return this.page.locator(this.CONFIRM_PASSWORD_INPUT);
  }

  get generatePasswordButton(): Locator {
    return this.page.locator(this.GENERATE_PASSWORD_BUTTON);
  }

  get showPasswordToggle(): Locator {
    return this.page.locator(this.SHOW_PASSWORD_TOGGLE);
  }

  get sendInviteCheckbox(): Locator {
    return this.page.locator(this.SEND_INVITE_CHECKBOX);
  }

  // Role and permissions field getters
  get roleSelect(): Locator {
    return this.page.locator(this.ROLE_SELECT);
  }

  get roleDescription(): Locator {
    return this.page.locator(this.ROLE_DESCRIPTION);
  }

  get departmentSelect(): Locator {
    return this.page.locator(this.DEPARTMENT_SELECT);
  }

  get managerSelect(): Locator {
    return this.page.locator(this.MANAGER_SELECT);
  }

  get permissionsList(): Locator {
    return this.page.locator(this.PERMISSIONS_LIST);
  }

  get customPermissionsToggle(): Locator {
    return this.page.locator(this.CUSTOM_PERMISSIONS_TOGGLE);
  }

  get customPermissionsPanel(): Locator {
    return this.page.locator(this.CUSTOM_PERMISSIONS_PANEL);
  }

  // Additional information field getters
  get employeeIdInput(): Locator {
    return this.page.locator(this.EMPLOYEE_ID_INPUT);
  }

  get startDateInput(): Locator {
    return this.page.locator(this.START_DATE_INPUT);
  }

  get officeLocationSelect(): Locator {
    return this.page.locator(this.OFFICE_LOCATION_SELECT);
  }

  get workTypeSelect(): Locator {
    return this.page.locator(this.WORK_TYPE_SELECT);
  }

  get timeZoneSelect(): Locator {
    return this.page.locator(this.TIME_ZONE_SELECT);
  }

  get languageSelect(): Locator {
    return this.page.locator(this.LANGUAGE_SELECT);
  }

  get profilePictureUpload(): Locator {
    return this.page.locator(this.PROFILE_PICTURE_UPLOAD);
  }

  get profilePicturePreview(): Locator {
    return this.page.locator(this.PROFILE_PICTURE_PREVIEW);
  }

  get removePictureButton(): Locator {
    return this.page.locator(this.REMOVE_PICTURE_BUTTON);
  }

  // Address field getters
  get addressSection(): Locator {
    return this.page.locator(this.ADDRESS_SECTION);
  }

  get streetInput(): Locator {
    return this.page.locator(this.STREET_INPUT);
  }

  get buildingNumberInput(): Locator {
    return this.page.locator(this.BUILDING_NUMBER_INPUT);
  }

  get apartmentNumberInput(): Locator {
    return this.page.locator(this.APARTMENT_NUMBER_INPUT);
  }

  get postalCodeInput(): Locator {
    return this.page.locator(this.POSTAL_CODE_INPUT);
  }

  get cityInput(): Locator {
    return this.page.locator(this.CITY_INPUT);
  }

  get countrySelect(): Locator {
    return this.page.locator(this.COUNTRY_SELECT);
  }

  get stateProvinceInput(): Locator {
    return this.page.locator(this.STATE_PROVINCE_INPUT);
  }

  // Confirmation section getters
  get userSummary(): Locator {
    return this.page.locator(this.USER_SUMMARY);
  }

  get summaryEmail(): Locator {
    return this.page.locator(this.SUMMARY_EMAIL);
  }

  get summaryName(): Locator {
    return this.page.locator(this.SUMMARY_NAME);
  }

  get summaryRole(): Locator {
    return this.page.locator(this.SUMMARY_ROLE);
  }

  get summaryDepartment(): Locator {
    return this.page.locator(this.SUMMARY_DEPARTMENT);
  }

  get summaryPermissions(): Locator {
    return this.page.locator(this.SUMMARY_PERMISSIONS);
  }

  // Error message getters
  get formError(): Locator {
    return this.page.locator(this.FORM_ERROR);
  }

  get emailError(): Locator {
    return this.page.locator(this.EMAIL_ERROR);
  }

  get firstNameError(): Locator {
    return this.page.locator(this.FIRST_NAME_ERROR);
  }

  get lastNameError(): Locator {
    return this.page.locator(this.LAST_NAME_ERROR);
  }

  get passwordError(): Locator {
    return this.page.locator(this.PASSWORD_ERROR);
  }

  get confirmPasswordError(): Locator {
    return this.page.locator(this.CONFIRM_PASSWORD_ERROR);
  }

  get roleError(): Locator {
    return this.page.locator(this.ROLE_ERROR);
  }

  get departmentError(): Locator {
    return this.page.locator(this.DEPARTMENT_ERROR);
  }

  // Password strength getters
  get passwordStrength(): Locator {
    return this.page.locator(this.PASSWORD_STRENGTH);
  }

  get strengthWeak(): Locator {
    return this.page.locator(this.STRENGTH_WEAK);
  }

  get strengthMedium(): Locator {
    return this.page.locator(this.STRENGTH_MEDIUM);
  }

  get strengthStrong(): Locator {
    return this.page.locator(this.STRENGTH_STRONG);
  }

  get passwordRequirements(): Locator {
    return this.page.locator(this.PASSWORD_REQUIREMENTS);
  }

  // Navigation button getters
  get nextButton(): Locator {
    return this.page.locator(this.NEXT_BUTTON);
  }

  get previousButton(): Locator {
    return this.page.locator(this.PREVIOUS_BUTTON);
  }

  get saveDraftButton(): Locator {
    return this.page.locator(this.SAVE_DRAFT_BUTTON);
  }

  get submitButton(): Locator {
    return this.page.locator(this.SUBMIT_BUTTON);
  }

  get cancelButton(): Locator {
    return this.page.locator(this.CANCEL_BUTTON);
  }

  // Success state getters
  get loadingSpinner(): Locator {
    return this.page.locator(this.LOADING_SPINNER);
  }

  get successMessage(): Locator {
    return this.page.locator(this.SUCCESS_MESSAGE);
  }

  get successIcon(): Locator {
    return this.page.locator(this.SUCCESS_ICON);
  }

  get viewUserButton(): Locator {
    return this.page.locator(this.VIEW_USER_BUTTON);
  }

  get createAnotherButton(): Locator {
    return this.page.locator(this.CREATE_ANOTHER_BUTTON);
  }

  // Modal getters
  get unsavedChangesModal(): Locator {
    return this.page.locator(this.UNSAVED_CHANGES_MODAL);
  }

  get discardChangesButton(): Locator {
    return this.page.locator(this.DISCARD_CHANGES_BUTTON);
  }

  get keepEditingButton(): Locator {
    return this.page.locator(this.KEEP_EDITING_BUTTON);
  }

  get duplicateEmailModal(): Locator {
    return this.page.locator(this.DUPLICATE_EMAIL_MODAL);
  }

  // Dynamic getters - methods for specific selections

  /**
   * Gets role option by role name
   */
  getRoleOption(roleName: string): Locator {
    return this.page.locator(`${this.ROLE_OPTION}[data-value="${roleName}"]`);
  }

  /**
   * Gets department option by department name
   */
  getDepartmentOption(departmentName: string): Locator {
    return this.page.locator(`${this.DEPARTMENT_OPTION}[data-value="${departmentName}"]`);
  }

  /**
   * Gets manager option by manager name
   */
  getManagerOption(managerName: string): Locator {
    return this.page.locator(`${this.MANAGER_OPTION}:has-text("${managerName}")`);
  }

  /**
   * Gets permission item by permission name
   */
  getPermissionItem(permissionName: string): Locator {
    return this.page.locator(`${this.PERMISSION_ITEM}[data-permission="${permissionName}"]`);
  }

  /**
   * Gets requirement item by requirement text
   */
  getRequirementItem(requirementText: string): Locator {
    return this.page.locator(`${this.REQUIREMENT_ITEM}:has-text("${requirementText}")`);
  }

  /**
   * Gets field error by field name
   */
  getFieldError(fieldName: string): Locator {
    return this.page.locator(`${this.FIELD_ERROR}[data-field="${fieldName}"]`);
  }

  /**
   * Gets edit section button for specific section
   */
  getEditSectionButton(sectionName: string): Locator {
    return this.page.locator(`${this.EDIT_SECTION_BUTTON}[data-section="${sectionName}"]`);
  }

  /**
   * Gets step by step number
   */
  getStepByNumber(stepNumber: number): Locator {
    return this.page.locator(`[data-testid="step-${stepNumber}"]`);
  }

  /**
   * Gets country option by country name
   */
  getCountryOption(countryName: string): Locator {
    return this.page.locator(`[data-testid="country-option"]:has-text("${countryName}")`);
  }

  /**
   * Gets office location option by location name
   */
  getOfficeLocationOption(locationName: string): Locator {
    return this.page.locator(`[data-testid="office-option"]:has-text("${locationName}")`);
  }

  /**
   * Gets work type option by work type
   */
  getWorkTypeOption(workType: string): Locator {
    return this.page.locator(`[data-testid="work-type-option"]:has-text("${workType}")`);
  }

  /**
   * Gets time zone option by time zone
   */
  getTimeZoneOption(timeZone: string): Locator {
    return this.page.locator(`[data-testid="timezone-option"]:has-text("${timeZone}")`);
  }

  /**
   * Gets language option by language
   */
  getLanguageOption(language: string): Locator {
    return this.page.locator(`[data-testid="language-option"]:has-text("${language}")`);
  }
}