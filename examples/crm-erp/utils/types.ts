/**
 * Core types for CRM/ERP examples
 * Extracted from production CRM/ERP patterns
 */

export enum LocatorState {
  Visible = "visible",
  Hidden = "hidden",
  Attached = "attached",
  Detached = "detached",
}

export enum FilterType {
  TEXT = "text",
  MULTISELECT = "multiselect",
  DATE_RANGE = "dateRange",
  SWITCH = "switch",
  NUMERIC_RANGE = "numericRange",
  DOTTED_STATUS = "dottedStatus",
}

export enum UserRole {
  Admin = 'admin',
  Manager = 'manager',
  User = 'user',
  ReadOnly = 'readonly',
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
  Suspended = 'suspended',
}

export enum DocumentType {
  Invoice = 'invoice',
  Receipt = 'receipt',
  Quote = 'quote',
  Order = 'order',
}

export enum DocumentStatus {
  Draft = 'draft',
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
  Completed = 'completed',
}

/**
 * Core User interface for CRM/ERP systems
 */
export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  department?: string;
  phoneNumber?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

/**
 * Address interface for entities
 */
export interface Address {
  street: string;
  buildingNumber: string;
  apartmentNumber?: string;
  postalCode: string;
  city: string;
  country: string;
}

/**
 * Filter definition for data grids
 */
export interface FilterDefinition {
  label: string;
  locator: () => import('@playwright/test').Locator;
  dataField: string;
  type: FilterType;
}

/**
 * Entity for generic CRUD operations
 */
export interface Entity {
  id?: string;
  name: string;
  description?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

/**
 * Notification interface
 */
export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

/**
 * Dashboard widget interface
 */
export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'stat' | 'list' | 'table';
  data: unknown;
  position: {
    row: number;
    col: number;
    width: number;
    height: number;
  };
}