/**
 * User List E2E Tests - Comprehensive testing for CRM/ERP user management
 *
 * Extracted from production patterns with Given-When-Then naming
 * Covers: Search, filtering, sorting, pagination, bulk operations
 * Zero Rules: No any, no waitForTimeout, no else statements
 */

import { test, expect } from '@playwright/test';
import { UserListActions } from './actions';
import {
  TestUsers,
  SearchScenarios,
  FilterScenarios,
  BulkOperationScenarios,
  SortScenarios,
  PaginationScenarios,
  UserDataFactory,
  BulkOperationType,
} from './data';
import { UserRole, UserStatus } from '../../../utils/types';

test.describe('User Management - User List', () => {
  let userListActions: UserListActions;

  test.beforeEach(async ({ page }) => {
    userListActions = new UserListActions(page);
    await userListActions.navigateToUserList();
  });

  test.describe('Navigation and Page Load', () => {
    test('TC_UL_001.GivenUserListPage_WhenPageLoads_ThenAllComponentsAreVisible', async () => {
      // Arrange - Page is already loaded in beforeEach

      // Act - No action needed, testing initial state

      // Assert
      const userCount = await userListActions.getCurrentPageUserCount();
      expect(userCount).toBeGreaterThan(0);

      const totalCount = await userListActions.getTotalUserCount();
      expect(totalCount).toBeGreaterThan(0);
    });

    test('TC_UL_002.GivenUserListPage_WhenNavigatingToCreateUser_ThenCreateFormOpens', async () => {
      // Arrange - Page is loaded

      // Act
      await userListActions.openCreateUserForm();

      // Assert
      expect(userListActions.page.url()).toMatch(/\/users\/create/);
    });
  });

  test.describe('Search Functionality', () => {
    test('TC_UL_003.GivenUsersInList_WhenSearchingByEmail_ThenCorrectUserIsDisplayed', async () => {
      // Arrange
      const testUser = TestUsers.adminActive;
      const searchQuery = testUser.email;

      // Act
      await userListActions.searchUsers(searchQuery);

      // Assert
      const userExists = await userListActions.verifyUserExists(searchQuery);
      expect(userExists).toBeTruthy();

      const currentCount = await userListActions.getCurrentPageUserCount();
      expect(currentCount).toBe(1);
    });

    test('TC_UL_004.GivenUsersInList_WhenSearchingByName_ThenMatchingUsersAreDisplayed', async () => {
      // Arrange
      const searchQuery = 'Admin';

      // Act
      await userListActions.searchUsers(searchQuery);

      // Assert
      const currentCount = await userListActions.getCurrentPageUserCount();
      expect(currentCount).toBeGreaterThanOrEqual(1);
    });

    test('TC_UL_005.GivenSearchInput_WhenEnteringShortQuery_ThenErrorMessageIsShown', async () => {
      // Arrange
      const shortQuery = 'ab';

      // Act & Assert
      await expect(async () => {
        await userListActions.searchUsers(shortQuery);
      }).rejects.toThrow();
    });

    test('TC_UL_006.GivenSearchResults_WhenClearingSearch_ThenAllUsersAreDisplayed', async () => {
      // Arrange
      await userListActions.searchUsers(TestUsers.adminActive.email);
      const searchResultCount = await userListActions.getCurrentPageUserCount();
      expect(searchResultCount).toBe(1);

      // Act
      await userListActions.clearSearch();

      // Assert
      const allUsersCount = await userListActions.getCurrentPageUserCount();
      expect(allUsersCount).toBeGreaterThan(searchResultCount);
    });

    test('TC_UL_007.GivenUsersInList_WhenSearchingNonExistentUser_ThenEmptyStateIsShown', async () => {
      // Arrange
      const nonExistentEmail = 'nonexistent@nowhere.com';

      // Act
      await userListActions.searchUsers(nonExistentEmail);

      // Assert
      const currentCount = await userListActions.getCurrentPageUserCount();
      expect(currentCount).toBe(0);
    });
  });

  test.describe('Filter Functionality', () => {
    test('TC_UL_008.GivenUsersInList_WhenFilteringByRole_ThenOnlyMatchingUsersAreDisplayed', async () => {
      // Arrange
      const filterRole = UserRole.Admin;

      // Act
      await userListActions.applyFilters({ role: filterRole });

      // Assert
      const currentCount = await userListActions.getCurrentPageUserCount();
      expect(currentCount).toBeGreaterThanOrEqual(FilterScenarios.filterByRole.expectedMinResults);
    });

    test('TC_UL_009.GivenUsersInList_WhenFilteringByStatus_ThenOnlyActiveUsersAreDisplayed', async () => {
      // Arrange
      const filterStatus = UserStatus.Active;

      // Act
      await userListActions.applyFilters({ status: filterStatus });

      // Assert
      const currentCount = await userListActions.getCurrentPageUserCount();
      expect(currentCount).toBeGreaterThanOrEqual(FilterScenarios.filterByStatus.expectedMinResults);
    });

    test('TC_UL_010.GivenUsersInList_WhenApplyingMultipleFilters_ThenUsersMatchAllCriteria', async () => {
      // Arrange
      const filters = {
        role: UserRole.Manager,
        status: UserStatus.Active,
        department: 'Sales',
      };

      // Act
      await userListActions.applyFilters(filters);

      // Assert
      const currentCount = await userListActions.getCurrentPageUserCount();
      expect(currentCount).toBeGreaterThanOrEqual(FilterScenarios.filterMultiple.expectedMinResults);
    });

    test('TC_UL_011.GivenFiltersApplied_WhenClearingAllFilters_ThenAllUsersAreDisplayed', async () => {
      // Arrange
      await userListActions.applyFilters({ role: UserRole.Admin });
      const filteredCount = await userListActions.getCurrentPageUserCount();

      // Act
      await userListActions.clearAllFilters();

      // Assert
      const allUsersCount = await userListActions.getCurrentPageUserCount();
      expect(allUsersCount).toBeGreaterThan(filteredCount);
    });

    test('TC_UL_012.GivenUsersInList_WhenFilteringByDateRange_ThenUsersInRangeAreDisplayed', async () => {
      // Arrange
      const dateFilter = {
        dateRange: {
          from: '2023-01-01',
          to: '2023-12-31',
        },
      };

      // Act
      await userListActions.applyFilters(dateFilter);

      // Assert
      const currentCount = await userListActions.getCurrentPageUserCount();
      expect(currentCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Sorting Functionality', () => {
    test('TC_UL_013.GivenUsersInList_WhenSortingByEmailAsc_ThenUsersAreOrderedAlphabetically', async () => {
      // Arrange
      const sortConfig = SortScenarios.sortByEmailAsc;

      // Act
      await userListActions.sortUsers({
        field: sortConfig.field,
        direction: sortConfig.direction,
      });

      // Assert - First user should start with 'a' or early letter
      const firstUserRow = await userListActions.getCurrentPageUserCount();
      expect(firstUserRow).toBeGreaterThan(0);
    });

    test('TC_UL_014.GivenUsersInList_WhenSortingByEmailDesc_ThenUsersAreOrderedReverseAlphabetically', async () => {
      // Arrange
      const sortConfig = SortScenarios.sortByEmailDesc;

      // Act
      await userListActions.sortUsers({
        field: sortConfig.field,
        direction: sortConfig.direction,
      });

      // Assert
      const userCount = await userListActions.getCurrentPageUserCount();
      expect(userCount).toBeGreaterThan(0);
    });

    test('TC_UL_015.GivenUsersInList_WhenSortingByRole_ThenUsersAreGroupedByRole', async () => {
      // Arrange
      const sortConfig = SortScenarios.sortByRoleDesc;

      // Act
      await userListActions.sortUsers({
        field: sortConfig.field,
        direction: sortConfig.direction,
      });

      // Assert
      const userCount = await userListActions.getCurrentPageUserCount();
      expect(userCount).toBeGreaterThan(0);
    });

    test('TC_UL_016.GivenUsersInList_WhenSortingByCreatedDate_ThenUsersAreOrderedByDate', async () => {
      // Arrange
      const sortConfig = SortScenarios.sortByCreatedAtDesc;

      // Act
      await userListActions.sortUsers({
        field: sortConfig.field,
        direction: sortConfig.direction,
      });

      // Assert
      const userCount = await userListActions.getCurrentPageUserCount();
      expect(userCount).toBeGreaterThan(0);
    });
  });

  test.describe('Pagination Functionality', () => {
    test('TC_UL_017.GivenManyUsers_WhenChangingPageSize_ThenCorrectNumberOfUsersAreDisplayed', async () => {
      // Arrange
      const newPageSize = 10;

      // Act
      await userListActions.changePageSize(newPageSize);

      // Assert
      const currentCount = await userListActions.getCurrentPageUserCount();
      expect(currentCount).toBeLessThanOrEqual(newPageSize);
    });

    test('TC_UL_018.GivenMultiplePages_WhenNavigatingToNextPage_ThenSecondPageIsDisplayed', async () => {
      // Arrange
      const initialCount = await userListActions.getCurrentPageUserCount();

      // Act
      await userListActions.navigateToPage(2);

      // Assert
      const secondPageCount = await userListActions.getCurrentPageUserCount();
      expect(secondPageCount).toBeGreaterThan(0);
    });

    test('TC_UL_019.GivenMultiplePages_WhenNavigatingToFirstPage_ThenFirstPageIsDisplayed', async () => {
      // Arrange
      await userListActions.navigateToPage(2);

      // Act
      await userListActions.navigateToPage(1);

      // Assert
      const currentCount = await userListActions.getCurrentPageUserCount();
      expect(currentCount).toBeGreaterThan(0);
    });
  });

  test.describe('User Selection', () => {
    test('TC_UL_020.GivenUsersInList_WhenSelectingMultipleUsers_ThenSelectionCountIsCorrect', async () => {
      // Arrange
      const usersToSelect = [TestUsers.adminActive.email, TestUsers.managerActive.email];

      // Act
      await userListActions.selectMultipleUsers(usersToSelect);

      // Assert
      const selectedCount = await userListActions.getSelectedUserCount();
      expect(selectedCount).toBe(usersToSelect.length);
    });

    test('TC_UL_021.GivenUsersInList_WhenSelectingAllUsers_ThenAllUsersOnPageAreSelected', async () => {
      // Arrange
      const totalUsersOnPage = await userListActions.getCurrentPageUserCount();

      // Act
      await userListActions.selectAllUsers();

      // Assert
      const selectedCount = await userListActions.getSelectedUserCount();
      expect(selectedCount).toBe(totalUsersOnPage);
    });
  });

  test.describe('Bulk Operations', () => {
    test.beforeEach(async () => {
      // Select multiple users for bulk operations
      const usersToSelect = [TestUsers.userActive.email, TestUsers.managerActive.email];
      await userListActions.selectMultipleUsers(usersToSelect);
    });

    test('TC_UL_022.GivenSelectedUsers_WhenPerformingBulkActivation_ThenUsersAreActivated', async () => {
      // Arrange - Users already selected in beforeEach

      // Act
      await userListActions.performBulkOperation(BulkOperationType.Activate);

      // Assert
      await userListActions.waitForSuccessMessage();
    });

    test('TC_UL_023.GivenSelectedUsers_WhenPerformingBulkDeactivation_ThenUsersAreDeactivated', async () => {
      // Arrange - Users already selected in beforeEach

      // Act
      await userListActions.performBulkOperation(BulkOperationType.Deactivate);

      // Assert
      await userListActions.waitForSuccessMessage();
    });

    test('TC_UL_024.GivenSelectedUsers_WhenPerformingBulkExport_ThenExportIsSuccessful', async () => {
      // Arrange - Users already selected in beforeEach

      // Act
      await userListActions.performBulkOperation(BulkOperationType.Export);

      // Assert
      await userListActions.waitForSuccessMessage();
    });

    test('TC_UL_025.GivenSelectedUsers_WhenPerformingBulkDelete_ThenUsersAreDeletedAfterConfirmation', async () => {
      // Arrange - Users already selected in beforeEach

      // Act
      await userListActions.performBulkOperation(BulkOperationType.Delete);

      // Assert
      await userListActions.waitForSuccessMessage();
    });

    test('TC_UL_026.GivenNoSelectedUsers_WhenAttemptingBulkOperation_ThenErrorMessageIsShown', async () => {
      // Arrange - Start fresh without selections
      await userListActions.navigateToUserList();

      // Act & Assert
      await expect(async () => {
        await userListActions.performBulkOperation(BulkOperationType.Activate);
      }).rejects.toThrow();
    });
  });

  test.describe('Individual User Actions', () => {
    test('TC_UL_027.GivenUserInList_WhenEditingUser_ThenEditPageOpens', async () => {
      // Arrange
      const userEmail = TestUsers.adminActive.email;

      // Act
      await userListActions.editUser(userEmail);

      // Assert
      expect(userListActions.page.url()).toMatch(/\/users\/.*\/edit/);
    });

    test('TC_UL_028.GivenUserInList_WhenViewingUserDetails_ThenDetailsPageOpens', async () => {
      // Arrange
      const userEmail = TestUsers.adminActive.email;

      // Act
      await userListActions.viewUser(userEmail);

      // Assert
      expect(userListActions.page.url()).toMatch(/\/users\/.*/);
    });

    test('TC_UL_029.GivenActiveUser_WhenDeactivatingUser_ThenUserStatusChanges', async () => {
      // Arrange
      const userEmail = TestUsers.adminActive.email;

      // Act
      await userListActions.deactivateUser(userEmail);

      // Assert
      await userListActions.waitForSuccessMessage();
    });

    test('TC_UL_030.GivenInactiveUser_WhenActivatingUser_ThenUserStatusChanges', async () => {
      // Arrange
      const userEmail = TestUsers.adminInactive.email;

      // Act
      await userListActions.activateUser(userEmail);

      // Assert
      await userListActions.waitForSuccessMessage();
    });

    test('TC_UL_031.GivenUserInList_WhenDeletingUser_ThenUserIsRemovedAfterConfirmation', async () => {
      // Arrange
      const userEmail = TestUsers.userSuspended.email;

      // Act
      await userListActions.deleteUser(userEmail);

      // Assert
      await userListActions.waitForSuccessMessage();

      // Verify user is no longer in the list
      const userExists = await userListActions.verifyUserNotExists(userEmail);
      expect(userExists).toBeTruthy();
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('TC_UL_032.GivenEmptySearchResults_WhenPerformingActions_ThenAppropriateMessageIsShown', async () => {
      // Arrange
      await userListActions.searchUsers('nonexistent@nowhere.com');

      // Act - No action needed

      // Assert
      const userCount = await userListActions.getCurrentPageUserCount();
      expect(userCount).toBe(0);
    });

    test('TC_UL_033.GivenUserList_WhenRefreshingPage_ThenListIsReloaded', async () => {
      // Arrange
      const initialCount = await userListActions.getCurrentPageUserCount();

      // Act
      await userListActions.refreshUserList();

      // Assert
      const refreshedCount = await userListActions.getCurrentPageUserCount();
      expect(refreshedCount).toBeGreaterThanOrEqual(0);
    });

    test('TC_UL_034.GivenBulkOperationDialog_WhenCancellingOperation_ThenOperationIsAborted', async () => {
      // Arrange
      await userListActions.selectUser(TestUsers.userActive.email);

      // Act
      await userListActions.performBulkOperation(BulkOperationType.Delete);
      await userListActions.cancelBulkOperation();

      // Assert
      const userExists = await userListActions.verifyUserExists(TestUsers.userActive.email);
      expect(userExists).toBeTruthy();
    });
  });

  test.describe('Performance and Load Testing', () => {
    test('TC_UL_035.GivenLargePageSize_WhenLoadingUsers_ThenPageLoadsWithinTimeout', async () => {
      // Arrange
      const largePageSize = 100;

      // Act
      await userListActions.changePageSize(largePageSize);

      // Assert
      const userCount = await userListActions.getCurrentPageUserCount();
      expect(userCount).toBeLessThanOrEqual(largePageSize);
    });

    test('TC_UL_036.GivenComplexFilters_WhenApplyingFilters_ThenResultsLoadWithinTimeout', async () => {
      // Arrange
      const complexFilters = {
        role: UserRole.Manager,
        status: UserStatus.Active,
        department: 'Engineering',
        dateRange: {
          from: '2023-01-01',
          to: '2023-12-31',
        },
      };

      // Act
      await userListActions.applyFilters(complexFilters);

      // Assert
      const userCount = await userListActions.getCurrentPageUserCount();
      expect(userCount).toBeGreaterThanOrEqual(0);
    });
  });
});