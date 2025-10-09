/**
 * UserListData - Test data and types for user management
 *
 * Extracted from production CRM/ERP patterns
 * Includes comprehensive user data, validation messages, and filter options
 */

import { faker } from '@faker-js/faker';
import { User, UserRole, UserStatus } from '../../../utils/types';

/**
 * Search criteria interface for user filtering
 */
export interface UserSearchCriteria {
  email?: string;
  name?: string;
  role?: UserRole;
  status?: UserStatus;
  department?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

/**
 * Bulk operation types
 */
export enum BulkOperationType {
  Activate = 'activate',
  Deactivate = 'deactivate',
  Delete = 'delete',
  Export = 'export',
  ChangeRole = 'changeRole',
  ChangeDepartment = 'changeDepartment',
}

/**
 * Sort configuration
 */
export interface SortConfig {
  field: 'email' | 'firstName' | 'lastName' | 'role' | 'status' | 'createdAt' | 'lastLoginAt';
  direction: 'asc' | 'desc';
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  page: number;
  pageSize: 10 | 25 | 50 | 100;
  totalItems?: number;
  totalPages?: number;
}

/**
 * User list view configuration
 */
export interface UserListConfig {
  search?: UserSearchCriteria;
  sort?: SortConfig;
  pagination?: PaginationConfig;
  selectedUsers?: string[];
}

/**
 * Department enumeration for test data
 */
export enum Department {
  Engineering = 'Engineering',
  Marketing = 'Marketing',
  Sales = 'Sales',
  HR = 'Human Resources',
  Finance = 'Finance',
  Operations = 'Operations',
  CustomerSupport = 'Customer Support',
  IT = 'IT',
}

/**
 * Validation error messages for user operations
 */
export const UserValidationMessages = {
  EMAIL_REQUIRED: 'Email address is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  EMAIL_ALREADY_EXISTS: 'Email address already exists',
  NAME_REQUIRED: 'First and last name are required',
  ROLE_REQUIRED: 'User role must be selected',
  DEPARTMENT_REQUIRED: 'Department must be selected',
  PASSWORD_REQUIRED: 'Password is required',
  BULK_SELECTION_REQUIRED: 'Please select at least one user',
  BULK_SELECTION_LIMIT: 'Cannot select more than 1000 users at once',
  SEARCH_MIN_LENGTH: 'Search query must be at least 3 characters',
  DATE_RANGE_INVALID: 'Invalid date range selected',
} as const;

/**
 * Success messages for user operations
 */
export const UserSuccessMessages = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  USER_ACTIVATED: 'User activated successfully',
  USER_DEACTIVATED: 'User deactivated successfully',
  BULK_OPERATION_SUCCESS: (count: number, operation: string) =>
    `Successfully ${operation} ${count} user${count > 1 ? 's' : ''}`,
  USERS_EXPORTED: 'User data exported successfully',
} as const;

/**
 * Test user data factory
 */
export class UserDataFactory {
  private static getRandomDepartment(): Department {
    const departments = Object.values(Department);
    return departments[Math.floor(Math.random() * departments.length)];
  }

  private static getRandomRole(): UserRole {
    const roles = Object.values(UserRole);
    return roles[Math.floor(Math.random() * roles.length)];
  }

  private static getRandomStatus(): UserStatus {
    const statuses = Object.values(UserStatus);
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  /**
   * Creates a single test user
   */
  static createUser(overrides: Partial<User> = {}): User {
    const baseUser: User = {
      id: faker.datatype.uuid(),
      email: faker.internet.email().toLowerCase(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: this.getRandomRole(),
      status: this.getRandomStatus(),
      department: this.getRandomDepartment(),
      phoneNumber: faker.phone.number(),
      createdAt: faker.date.past(2).toISOString(),
      lastLoginAt: faker.date.recent(30).toISOString(),
    };

    return { ...baseUser, ...overrides };
  }

  /**
   * Creates multiple test users
   */
  static createUsers(count: number, baseData: Partial<User> = {}): User[] {
    return Array.from({ length: count }, () => this.createUser(baseData));
  }

  /**
   * Creates users with specific roles
   */
  static createUsersByRole(counts: Partial<Record<UserRole, number>>): User[] {
    const users: User[] = [];

    Object.entries(counts).forEach(([role, count]) => {
      if (count && count > 0) {
        const roleUsers = this.createUsers(count, { role: role as UserRole });
        users.push(...roleUsers);
      }
    });

    return users;
  }

  /**
   * Creates users with specific statuses
   */
  static createUsersByStatus(counts: Partial<Record<UserStatus, number>>): User[] {
    const users: User[] = [];

    Object.entries(counts).forEach(([status, count]) => {
      if (count && count > 0) {
        const statusUsers = this.createUsers(count, { status: status as UserStatus });
        users.push(...statusUsers);
      }
    });

    return users;
  }

  /**
   * Creates users for specific departments
   */
  static createUsersByDepartment(counts: Partial<Record<Department, number>>): User[] {
    const users: User[] = [];

    Object.entries(counts).forEach(([department, count]) => {
      if (count && count > 0) {
        const deptUsers = this.createUsers(count, { department: department as Department });
        users.push(...deptUsers);
      }
    });

    return users;
  }
}

/**
 * Predefined test users for consistent testing
 */
export const TestUsers = {
  // Admin users
  adminActive: UserDataFactory.createUser({
    email: 'admin.active@example.com',
    firstName: 'Admin',
    lastName: 'Active',
    role: UserRole.Admin,
    status: UserStatus.Active,
    department: Department.IT,
  }),

  adminInactive: UserDataFactory.createUser({
    email: 'admin.inactive@example.com',
    firstName: 'Admin',
    lastName: 'Inactive',
    role: UserRole.Admin,
    status: UserStatus.Inactive,
    department: Department.IT,
  }),

  // Manager users
  managerActive: UserDataFactory.createUser({
    email: 'manager.active@example.com',
    firstName: 'Manager',
    lastName: 'Active',
    role: UserRole.Manager,
    status: UserStatus.Active,
    department: Department.Sales,
  }),

  managerPending: UserDataFactory.createUser({
    email: 'manager.pending@example.com',
    firstName: 'Manager',
    lastName: 'Pending',
    role: UserRole.Manager,
    status: UserStatus.Pending,
    department: Department.Marketing,
  }),

  // Regular users
  userActive: UserDataFactory.createUser({
    email: 'user.active@example.com',
    firstName: 'User',
    lastName: 'Active',
    role: UserRole.User,
    status: UserStatus.Active,
    department: Department.CustomerSupport,
  }),

  userSuspended: UserDataFactory.createUser({
    email: 'user.suspended@example.com',
    firstName: 'User',
    lastName: 'Suspended',
    role: UserRole.User,
    status: UserStatus.Suspended,
    department: Department.Operations,
  }),

  // Read-only users
  readonlyUser: UserDataFactory.createUser({
    email: 'readonly@example.com',
    firstName: 'ReadOnly',
    lastName: 'User',
    role: UserRole.ReadOnly,
    status: UserStatus.Active,
    department: Department.Finance,
  }),
} as const;

/**
 * Search test data scenarios
 */
export const SearchScenarios = {
  searchByEmail: {
    query: 'admin@example.com',
    expectedResults: 1,
  },

  searchByName: {
    query: 'John Smith',
    expectedResults: 2,
  },

  searchByPartialEmail: {
    query: '@example.com',
    expectedResults: 50,
  },

  searchNoResults: {
    query: 'nonexistent@nowhere.com',
    expectedResults: 0,
  },

  searchMinLength: {
    query: 'ab',
    shouldShowError: true,
    errorMessage: UserValidationMessages.SEARCH_MIN_LENGTH,
  },
} as const;

/**
 * Filter test scenarios
 */
export const FilterScenarios = {
  filterByRole: {
    role: UserRole.Admin,
    expectedMinResults: 1,
  },

  filterByStatus: {
    status: UserStatus.Active,
    expectedMinResults: 10,
  },

  filterByDepartment: {
    department: Department.Engineering,
    expectedMinResults: 5,
  },

  filterMultiple: {
    role: UserRole.Manager,
    status: UserStatus.Active,
    department: Department.Sales,
    expectedMinResults: 1,
  },

  filterDateRange: {
    dateRange: {
      from: '2023-01-01',
      to: '2023-12-31',
    },
    expectedMinResults: 20,
  },
} as const;

/**
 * Bulk operation test scenarios
 */
export const BulkOperationScenarios = {
  activateUsers: {
    operation: BulkOperationType.Activate,
    userEmails: ['user1@example.com', 'user2@example.com'],
    expectedSuccessMessage: UserSuccessMessages.BULK_OPERATION_SUCCESS(2, 'activated'),
  },

  deactivateUsers: {
    operation: BulkOperationType.Deactivate,
    userEmails: ['user3@example.com'],
    expectedSuccessMessage: UserSuccessMessages.BULK_OPERATION_SUCCESS(1, 'deactivated'),
  },

  deleteUsers: {
    operation: BulkOperationType.Delete,
    userEmails: ['user4@example.com', 'user5@example.com', 'user6@example.com'],
    expectedSuccessMessage: UserSuccessMessages.BULK_OPERATION_SUCCESS(3, 'deleted'),
    requiresConfirmation: true,
  },

  exportUsers: {
    operation: BulkOperationType.Export,
    userEmails: ['user1@example.com', 'user2@example.com', 'user3@example.com'],
    expectedSuccessMessage: UserSuccessMessages.USERS_EXPORTED,
  },
} as const;

/**
 * Sorting test scenarios
 */
export const SortScenarios = {
  sortByEmailAsc: {
    field: 'email' as const,
    direction: 'asc' as const,
    expectedFirstItem: 'a@example.com',
  },

  sortByEmailDesc: {
    field: 'email' as const,
    direction: 'desc' as const,
    expectedFirstItem: 'z@example.com',
  },

  sortByNameAsc: {
    field: 'firstName' as const,
    direction: 'asc' as const,
    expectedFirstItem: 'Aaron',
  },

  sortByRoleDesc: {
    field: 'role' as const,
    direction: 'desc' as const,
    expectedFirstItem: UserRole.User,
  },

  sortByCreatedAtDesc: {
    field: 'createdAt' as const,
    direction: 'desc' as const,
    description: 'Most recently created first',
  },
} as const;

/**
 * Pagination test scenarios
 */
export const PaginationScenarios = {
  defaultPageSize: {
    pageSize: 25 as const,
    totalItems: 100,
    expectedPages: 4,
  },

  smallPageSize: {
    pageSize: 10 as const,
    totalItems: 100,
    expectedPages: 10,
  },

  largePageSize: {
    pageSize: 100 as const,
    totalItems: 100,
    expectedPages: 1,
  },

  navigation: {
    totalItems: 250,
    pageSize: 25 as const,
    testPages: [1, 5, 10],
  },
} as const;