# CRM/ERP Patterns with CDAT

> **Enterprise-grade test patterns for Customer Relationship Management and Enterprise Resource Planning systems**

## Overview

The CRM/ERP patterns demonstrate advanced CDAT implementations for complex business applications. These patterns go beyond simple e-commerce scenarios to tackle enterprise-specific challenges like:

- Advanced user management with role-based permissions
- Sophisticated data grids with multiple filter types
- Complex multi-step form workflows
- Document management and approval processes
- Bulk operations with confirmation workflows

## When to Use CRM/ERP Patterns

Choose CRM/ERP patterns over e-commerce patterns when your application includes:

### Business Application Features
- **User Management**: Roles, permissions, departments, hierarchies
- **Data Grids**: Advanced filtering, sorting, bulk operations
- **Complex Forms**: Multi-step wizards, conditional fields, validation
- **Document Workflows**: Creation, approval, revision tracking
- **Administrative Functions**: System configuration, reporting, analytics

### Technical Characteristics
- **Enterprise UI**: Dense information displays, data tables
- **Conditional Logic**: Fields that show/hide based on selections
- **Bulk Operations**: Mass updates, exports, imports
- **State Management**: Complex form states, multi-step processes
- **Advanced Interactions**: Drag-and-drop, inline editing, tooltips

## Key Patterns Demonstrated

### 1. Advanced Data Grid (`shared/components/data-grid.ts`)

**6 Filter Types Supported:**
- `TEXT` - Search within text fields
- `MULTISELECT` - Multiple option selection
- `DATE_RANGE` - Start and end date filtering
- `SWITCH` - Boolean toggle filters
- `NUMERIC_RANGE` - Min/max number filtering
- `DOTTED_STATUS` - Status indicator filtering

**Enterprise Features:**
```typescript
// Multi-criteria filtering
await gridActions.applyFilter({
  columnKey: 'status',
  filterType: FilterType.MULTISELECT,
  value: ['Active', 'Pending', 'Review']
});

// Bulk operations with confirmation
await gridActions.performBulkOperation({
  actionName: 'approve',
  selectedRows: [1, 3, 7, 12],
  requiresConfirmation: true
});
```

### 2. Complex Form Handling (`features/user-management/create-user/`)

**Multi-step Wizard Pattern:**
```typescript
// Step-by-step form completion
await createUserActions.fillBasicInformation(userData);
await createUserActions.proceedToNextStep();
await createUserActions.configureRolePermissions(userData);
await createUserActions.proceedToNextStep();
await createUserActions.addAdditionalInformation(userData);
await createUserActions.submitForm();
```

**Conditional Field Display:**
```typescript
// Fields that appear based on role selection
if (userData.role === UserRole.Manager) {
  await createUserActions.selectDepartment(userData.department);
  await createUserActions.assignDirectReports(userData.reports);
}
```

### 3. User Management (`features/user-management/`)

**Role-Based Access Control:**
```typescript
// Permission-based testing
await userActions.createUser(managerData, {
  permissions: [
    Permission.ViewUsers,
    Permission.EditUsers,
    Permission.ViewReports
  ]
});
```

**Advanced Search and Filtering:**
```typescript
// Multi-criteria user search
await userListActions.applyFilters({
  role: UserRole.Manager,
  status: UserStatus.Active,
  department: 'Engineering',
  dateRange: {
    from: '2023-01-01',
    to: '2023-12-31'
  }
});
```

## Comparison with E-commerce Patterns

| Feature | CRM/ERP Focus | E-commerce Focus |
|---------|---------------|------------------|
| **Users** | Roles, permissions, departments | Customer accounts |
| **Data Display** | Advanced grids, bulk operations | Product catalogs |
| **Forms** | Multi-step, conditional validation | Checkout flows |
| **Search** | Complex filters, saved searches | Product search |
| **Operations** | Approval workflows, bulk actions | Order processing |
| **Documents** | Contracts, invoices, reports | Orders, receipts |
| **Navigation** | Hierarchical, role-based | Category browsing |

## Production-Ready Features

### Smart Utility Methods

The CRM/ERP examples include 8 enhanced Cdat methods:

```typescript
// Grid reload detection
await Cdat.waitForGridReload(page, dataGrid);

// Custom dropdown handling
await Cdat.selectOption(roleDropdown, 'Administrator');

// File upload with verification
await Cdat.uploadFile(documentUpload, './contract.pdf');

// Form submission with loading states
await Cdat.waitForFormSubmit(createUserForm);

// Tooltip interactions
const helpText = await Cdat.hoverAndGetTooltip(helpIcon);

// Non-throwing text checks
const hasError = await Cdat.containsText(messageArea, 'Error');

// Enhanced scrolling
await Cdat.scrollIntoView(bottomElement);

// Navigation with click
await Cdat.clickAndWaitForNavigation(saveButton, page, '/success');
```

### Error Handling

Production-grade error handling with detailed messages:

```typescript
try {
  await userActions.performBulkDelete(userIds);
} catch (error) {
  if (error.message.includes('insufficient permissions')) {
    // Handle permission error
  } else if (error.message.includes('users have active sessions')) {
    // Handle business rule violation
  }
}
```

### Test Data Factories

Realistic test data generation:

```typescript
// Role-specific user creation
const adminUser = CreateUserDataFactory.createAdminUserData({
  department: 'IT',
  permissions: Permission.ALL_ADMIN_PERMISSIONS
});

const managerUser = CreateUserDataFactory.createManagerUserData({
  department: 'Sales',
  directReports: 5
});
```

## Architecture Benefits

### Separation of Concerns
- **Components**: Complex grid and modal locators
- **Data**: Business entity types and test data
- **Actions**: Multi-step business workflows
- **Tests**: Comprehensive scenario coverage

### Composition Patterns
```typescript
// Reusable grid actions across features
export class UserListActions extends DataGridActions {
  async searchUsersByDepartment(department: string) {
    await this.applyFilter({
      columnKey: 'department',
      filterType: FilterType.MULTISELECT,
      value: [department]
    });
  }
}
```

### Type Safety
```typescript
interface CreateUserFormData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions?: Permission[];
  address?: Address;
  // ... 15+ more typed fields
}
```

## Getting Started

1. **Review the Examples**: Start with `/examples/crm-erp/README.md`
2. **Understand the Patterns**: Study the shared components
3. **Adapt to Your Domain**: Use as templates for your business application
4. **Follow the Zero Rules**: No `any`, no `waitForTimeout`, no `else`

## Migration from POM

### Before (Page Object Model)
```typescript
class UserManagementPage {
  async createUser(userData: any) {
    await this.fillForm(userData);
    await this.clickSubmit();
    // 500+ lines of mixed concerns
  }
}
```

### After (CDAT Pattern)
```typescript
// Separated concerns across 4 files
class CreateUserComponents { /* locators only */ }
class CreateUserData { /* types & test data */ }
class CreateUserActions { /* business logic */ }
class CreateUserTests { /* scenarios & assertions */ }
```

## Best Practices

1. **Start with Shared Components**: Build reusable grid and modal patterns
2. **Use Type-Safe Data**: Define comprehensive interfaces
3. **Compose Actions**: Build complex workflows from simple methods
4. **Test Edge Cases**: Business applications have many validation rules
5. **Handle Permissions**: Test role-based access scenarios

## Related Documentation

- [Basic Example](../examples/basic/) - Start here for CDAT fundamentals
- [E-commerce Example](../examples/e-commerce/) - Consumer application patterns
- [Architecture Guide](./ARCHITECTURE.md) - Deep dive into CDAT layers
- [Smart Waits](./SMART-WAITS.md) - Utility method reference

---

**Ready to build enterprise-grade test automation with CDAT Pattern!** 🏢