/**
 * CreateUserData - Test data and types for user creation form
 *
 * Extracted from production CRM/ERP patterns
 * Features: Multi-step form data, validation patterns, complex form scenarios
 */

import { faker } from '@faker-js/faker';
import { User, UserRole, UserStatus, Address } from '../../../utils/types';

/**
 * Form step enumeration
 */
export enum FormStep {
  BasicInfo = 'basic-info',
  RolePermissions = 'role-permissions',
  AdditionalInfo = 'additional-info',
  Confirmation = 'confirmation',
}

/**
 * Work type options
 */
export enum WorkType {
  FullTime = 'full-time',
  PartTime = 'part-time',
  Contract = 'contract',
  Intern = 'intern',
  Remote = 'remote',
  Hybrid = 'hybrid',
}

/**
 * Office location options
 */
export enum OfficeLocation {
  NewYork = 'New York',
  SanFrancisco = 'San Francisco',
  London = 'London',
  Toronto = 'Toronto',
  Sydney = 'Sydney',
  Remote = 'Remote',
}

/**
 * Permission categories for role-based access
 */
export enum PermissionCategory {
  Users = 'users',
  Documents = 'documents',
  Reports = 'reports',
  Settings = 'settings',
  Billing = 'billing',
  Analytics = 'analytics',
}

/**
 * Individual permissions
 */
export enum Permission {
  // User permissions
  ViewUsers = 'users.view',
  CreateUsers = 'users.create',
  EditUsers = 'users.edit',
  DeleteUsers = 'users.delete',
  ManageUserRoles = 'users.roles',

  // Document permissions
  ViewDocuments = 'documents.view',
  CreateDocuments = 'documents.create',
  EditDocuments = 'documents.edit',
  DeleteDocuments = 'documents.delete',
  ApproveDocuments = 'documents.approve',

  // Report permissions
  ViewReports = 'reports.view',
  CreateReports = 'reports.create',
  ExportReports = 'reports.export',
  ScheduleReports = 'reports.schedule',

  // Settings permissions
  ViewSettings = 'settings.view',
  EditSettings = 'settings.edit',
  ManageIntegrations = 'settings.integrations',
  ManageSecurity = 'settings.security',

  // Billing permissions
  ViewBilling = 'billing.view',
  ManageBilling = 'billing.manage',
  ViewInvoices = 'billing.invoices',

  // Analytics permissions
  ViewAnalytics = 'analytics.view',
  ExportAnalytics = 'analytics.export',
}

/**
 * Complete user creation form data interface
 */
export interface CreateUserFormData {
  // Basic information
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
  sendInvite: boolean;

  // Role and permissions
  role: UserRole;
  department: string;
  managerId?: string;
  customPermissions?: Permission[];
  useCustomPermissions: boolean;

  // Additional information
  employeeId?: string;
  startDate: string;
  officeLocation: OfficeLocation;
  workType: WorkType;
  timeZone: string;
  language: string;
  profilePicture?: string;

  // Address information
  address?: Address;
}

/**
 * Form validation rules
 */
export const ValidationRules = {
  EMAIL: {
    REQUIRED: 'Email address is required',
    INVALID_FORMAT: 'Please enter a valid email address',
    ALREADY_EXISTS: 'This email address is already in use',
    MAX_LENGTH: 'Email must be less than 255 characters',
  },

  NAME: {
    FIRST_NAME_REQUIRED: 'First name is required',
    LAST_NAME_REQUIRED: 'Last name is required',
    MIN_LENGTH: 'Name must be at least 2 characters long',
    MAX_LENGTH: 'Name must be less than 50 characters',
    INVALID_CHARACTERS: 'Name contains invalid characters',
  },

  PASSWORD: {
    REQUIRED: 'Password is required',
    MIN_LENGTH: 'Password must be at least 8 characters long',
    MAX_LENGTH: 'Password must be less than 128 characters',
    MISSING_UPPERCASE: 'Password must contain at least one uppercase letter',
    MISSING_LOWERCASE: 'Password must contain at least one lowercase letter',
    MISSING_NUMBER: 'Password must contain at least one number',
    MISSING_SPECIAL: 'Password must contain at least one special character',
    WEAK_PASSWORD: 'Password is too weak',
  },

  CONFIRM_PASSWORD: {
    REQUIRED: 'Please confirm your password',
    MISMATCH: 'Passwords do not match',
  },

  PHONE: {
    INVALID_FORMAT: 'Please enter a valid phone number',
    TOO_SHORT: 'Phone number is too short',
    TOO_LONG: 'Phone number is too long',
  },

  ROLE: {
    REQUIRED: 'Please select a user role',
    INVALID_ROLE: 'Selected role is not valid',
  },

  DEPARTMENT: {
    REQUIRED: 'Please select a department',
    INVALID_DEPARTMENT: 'Selected department is not valid',
  },

  EMPLOYEE_ID: {
    ALREADY_EXISTS: 'This employee ID is already in use',
    INVALID_FORMAT: 'Employee ID format is invalid',
    TOO_LONG: 'Employee ID is too long',
  },

  START_DATE: {
    REQUIRED: 'Start date is required',
    INVALID_DATE: 'Please enter a valid date',
    PAST_DATE: 'Start date cannot be in the past',
    TOO_FAR_FUTURE: 'Start date cannot be more than 1 year in the future',
  },

  ADDRESS: {
    STREET_REQUIRED: 'Street address is required when address is provided',
    CITY_REQUIRED: 'City is required when address is provided',
    POSTAL_CODE_REQUIRED: 'Postal code is required when address is provided',
    COUNTRY_REQUIRED: 'Country is required when address is provided',
    INVALID_POSTAL_CODE: 'Invalid postal code format',
  },
} as const;

/**
 * Success messages for user creation
 */
export const SuccessMessages = {
  USER_CREATED: 'User created successfully',
  INVITATION_SENT: 'Invitation email sent to user',
  DRAFT_SAVED: 'Draft saved successfully',
  PASSWORD_GENERATED: 'Password generated successfully',
  PICTURE_UPLOADED: 'Profile picture uploaded successfully',
  PICTURE_REMOVED: 'Profile picture removed',
} as const;

/**
 * Role definitions with default permissions
 */
export const RoleDefinitions = {
  [UserRole.Admin]: {
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: Object.values(Permission),
  },
  [UserRole.Manager]: {
    name: 'Manager',
    description: 'Department management with limited administrative access',
    permissions: [
      Permission.ViewUsers,
      Permission.CreateUsers,
      Permission.EditUsers,
      Permission.ViewDocuments,
      Permission.CreateDocuments,
      Permission.EditDocuments,
      Permission.ViewReports,
      Permission.CreateReports,
      Permission.ExportReports,
      Permission.ViewAnalytics,
    ],
  },
  [UserRole.User]: {
    name: 'User',
    description: 'Standard user with basic access permissions',
    permissions: [
      Permission.ViewUsers,
      Permission.ViewDocuments,
      Permission.CreateDocuments,
      Permission.ViewReports,
      Permission.ViewAnalytics,
    ],
  },
  [UserRole.ReadOnly]: {
    name: 'Read Only',
    description: 'View-only access to system resources',
    permissions: [
      Permission.ViewUsers,
      Permission.ViewDocuments,
      Permission.ViewReports,
      Permission.ViewAnalytics,
    ],
  },
} as const;

/**
 * Department options
 */
export const DepartmentOptions = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Customer Success',
  'Human Resources',
  'Finance',
  'Operations',
  'Legal',
  'IT',
  'Quality Assurance',
] as const;

/**
 * Language options
 */
export const LanguageOptions = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
] as const;

/**
 * Time zone options (subset for testing)
 */
export const TimeZoneOptions = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Australia/Sydney',
] as const;

/**
 * Password requirements configuration
 */
export const PasswordRequirements = [
  { text: 'At least 8 characters long', pattern: /.{8,}/ },
  { text: 'Contains uppercase letter', pattern: /[A-Z]/ },
  { text: 'Contains lowercase letter', pattern: /[a-z]/ },
  { text: 'Contains number', pattern: /\d/ },
  { text: 'Contains special character', pattern: /[!@#$%^&*(),.?":{}|<>]/ },
] as const;

/**
 * User creation form data factory
 */
export class CreateUserDataFactory {
  /**
   * Generates a strong password
   */
  static generateStrongPassword(): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Add more random characters
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Creates basic user form data
   */
  static createBasicUserData(overrides: Partial<CreateUserFormData> = {}): CreateUserFormData {
    const password = this.generateStrongPassword();

    const baseData: CreateUserFormData = {
      email: faker.internet.email().toLowerCase(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phoneNumber: faker.phone.number(),
      password,
      confirmPassword: password,
      sendInvite: true,
      role: UserRole.User,
      department: DepartmentOptions[Math.floor(Math.random() * DepartmentOptions.length)],
      useCustomPermissions: false,
      startDate: faker.date.future(0.5).toISOString().split('T')[0], // Within 6 months
      officeLocation: OfficeLocation.NewYork,
      workType: WorkType.FullTime,
      timeZone: 'America/New_York',
      language: 'en',
    };

    return { ...baseData, ...overrides };
  }

  /**
   * Creates user data with address
   */
  static createUserWithAddress(overrides: Partial<CreateUserFormData> = {}): CreateUserFormData {
    const userData = this.createBasicUserData(overrides);

    userData.address = {
      street: faker.location.streetAddress(),
      buildingNumber: faker.location.buildingNumber(),
      apartmentNumber: faker.datatype.boolean() ? faker.location.secondaryAddress() : undefined,
      postalCode: faker.location.zipCode(),
      city: faker.location.city(),
      country: faker.location.country(),
    };

    return userData;
  }

  /**
   * Creates admin user data
   */
  static createAdminUserData(overrides: Partial<CreateUserFormData> = {}): CreateUserFormData {
    return this.createBasicUserData({
      role: UserRole.Admin,
      department: 'IT',
      useCustomPermissions: false,
      ...overrides,
    });
  }

  /**
   * Creates manager user data
   */
  static createManagerUserData(overrides: Partial<CreateUserFormData> = {}): CreateUserFormData {
    return this.createBasicUserData({
      role: UserRole.Manager,
      department: 'Engineering',
      useCustomPermissions: false,
      ...overrides,
    });
  }

  /**
   * Creates user with custom permissions
   */
  static createUserWithCustomPermissions(overrides: Partial<CreateUserFormData> = {}): CreateUserFormData {
    return this.createBasicUserData({
      role: UserRole.User,
      useCustomPermissions: true,
      customPermissions: [
        Permission.ViewUsers,
        Permission.ViewDocuments,
        Permission.CreateDocuments,
        Permission.ViewReports,
      ],
      ...overrides,
    });
  }

  /**
   * Creates minimal required user data
   */
  static createMinimalUserData(overrides: Partial<CreateUserFormData> = {}): Partial<CreateUserFormData> {
    const password = this.generateStrongPassword();

    return {
      email: faker.internet.email().toLowerCase(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password,
      confirmPassword: password,
      role: UserRole.User,
      department: DepartmentOptions[0],
      startDate: new Date().toISOString().split('T')[0],
      sendInvite: false,
      useCustomPermissions: false,
      officeLocation: OfficeLocation.NewYork,
      workType: WorkType.FullTime,
      timeZone: 'America/New_York',
      language: 'en',
      ...overrides,
    };
  }
}

/**
 * Test scenarios for user creation
 */
export const UserCreationScenarios = {
  // Valid scenarios
  validBasicUser: {
    data: CreateUserDataFactory.createBasicUserData(),
    description: 'Create user with all required fields',
    expectedSuccess: true,
  },

  validAdminUser: {
    data: CreateUserDataFactory.createAdminUserData(),
    description: 'Create admin user with full permissions',
    expectedSuccess: true,
  },

  validManagerUser: {
    data: CreateUserDataFactory.createManagerUserData(),
    description: 'Create manager user with department permissions',
    expectedSuccess: true,
  },

  validUserWithAddress: {
    data: CreateUserDataFactory.createUserWithAddress(),
    description: 'Create user with complete address information',
    expectedSuccess: true,
  },

  validUserWithCustomPermissions: {
    data: CreateUserDataFactory.createUserWithCustomPermissions(),
    description: 'Create user with custom permission set',
    expectedSuccess: true,
  },

  // Invalid scenarios
  invalidEmailFormat: {
    data: CreateUserDataFactory.createBasicUserData({ email: 'invalid-email' }),
    description: 'Create user with invalid email format',
    expectedSuccess: false,
    expectedError: ValidationRules.EMAIL.INVALID_FORMAT,
  },

  duplicateEmail: {
    data: CreateUserDataFactory.createBasicUserData({ email: 'existing@example.com' }),
    description: 'Create user with existing email address',
    expectedSuccess: false,
    expectedError: ValidationRules.EMAIL.ALREADY_EXISTS,
  },

  missingFirstName: {
    data: CreateUserDataFactory.createBasicUserData({ firstName: '' }),
    description: 'Create user without first name',
    expectedSuccess: false,
    expectedError: ValidationRules.NAME.FIRST_NAME_REQUIRED,
  },

  missingLastName: {
    data: CreateUserDataFactory.createBasicUserData({ lastName: '' }),
    description: 'Create user without last name',
    expectedSuccess: false,
    expectedError: ValidationRules.NAME.LAST_NAME_REQUIRED,
  },

  weakPassword: {
    data: CreateUserDataFactory.createBasicUserData({
      password: '123',
      confirmPassword: '123'
    }),
    description: 'Create user with weak password',
    expectedSuccess: false,
    expectedError: ValidationRules.PASSWORD.MIN_LENGTH,
  },

  passwordMismatch: {
    data: CreateUserDataFactory.createBasicUserData({
      password: 'StrongPass123!',
      confirmPassword: 'DifferentPass456!'
    }),
    description: 'Create user with password confirmation mismatch',
    expectedSuccess: false,
    expectedError: ValidationRules.CONFIRM_PASSWORD.MISMATCH,
  },

  missingRole: {
    data: { ...CreateUserDataFactory.createMinimalUserData(), role: undefined } as CreateUserFormData,
    description: 'Create user without selecting role',
    expectedSuccess: false,
    expectedError: ValidationRules.ROLE.REQUIRED,
  },

  missingDepartment: {
    data: CreateUserDataFactory.createBasicUserData({ department: '' }),
    description: 'Create user without selecting department',
    expectedSuccess: false,
    expectedError: ValidationRules.DEPARTMENT.REQUIRED,
  },

  invalidStartDate: {
    data: CreateUserDataFactory.createBasicUserData({
      startDate: '2020-01-01' // Past date
    }),
    description: 'Create user with start date in the past',
    expectedSuccess: false,
    expectedError: ValidationRules.START_DATE.PAST_DATE,
  },

  // Edge cases
  longName: {
    data: CreateUserDataFactory.createBasicUserData({
      firstName: 'A'.repeat(51),
      lastName: 'B'.repeat(51),
    }),
    description: 'Create user with very long names',
    expectedSuccess: false,
    expectedError: ValidationRules.NAME.MAX_LENGTH,
  },

  specialCharactersInName: {
    data: CreateUserDataFactory.createBasicUserData({
      firstName: 'John@123',
      lastName: 'Doe#456',
    }),
    description: 'Create user with special characters in name',
    expectedSuccess: false,
    expectedError: ValidationRules.NAME.INVALID_CHARACTERS,
  },

  maxLengthEmail: {
    data: CreateUserDataFactory.createBasicUserData({
      email: 'a'.repeat(250) + '@example.com'
    }),
    description: 'Create user with maximum length email',
    expectedSuccess: false,
    expectedError: ValidationRules.EMAIL.MAX_LENGTH,
  },
} as const;

/**
 * Form navigation scenarios
 */
export const FormNavigationScenarios = {
  completeAllSteps: {
    description: 'Complete all form steps in sequence',
    steps: [FormStep.BasicInfo, FormStep.RolePermissions, FormStep.AdditionalInfo, FormStep.Confirmation],
  },

  backAndForth: {
    description: 'Navigate back and forth between steps',
    steps: [
      FormStep.BasicInfo,
      FormStep.RolePermissions,
      FormStep.BasicInfo,
      FormStep.RolePermissions,
      FormStep.AdditionalInfo,
      FormStep.Confirmation
    ],
  },

  cancelAndResume: {
    description: 'Cancel form and resume from saved draft',
    includeCancel: true,
    includeDraft: true,
  },

  skipOptionalSteps: {
    description: 'Skip optional steps and create user with minimal data',
    steps: [FormStep.BasicInfo, FormStep.RolePermissions, FormStep.Confirmation],
  },
} as const;