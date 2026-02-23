# Requirements Document

## Introduction

This feature extracts the Income tab from the Finance section into its own standalone HTML page, following the same pattern as the existing Transactions page. The Income tab currently exists within the finance.html pages but needs to be separated into dedicated income.html pages for admin, client, and employee roles while maintaining navigation consistency across the Finance section.

## Glossary

- **Finance Section**: The collection of finance-related pages including Topups, Finance, Income, Charges, Internal Transactions, and Transactions
- **Income Tab**: The current tab within finance.html that displays monthly income data from fees
- **Page Tabs**: The navigation tabs at the top of Finance pages that allow switching between different Finance section pages
- **System**: The finance management application
- **Role**: User access level (admin, client, or employee)

## Requirements

### Requirement 1: Create Standalone Income Pages

**User Story:** As a developer, I want to create separate income.html files for each role, so that the Income functionality is isolated from the main finance.html page.

#### Acceptance Criteria

1. THE System SHALL create admin/income.html as a standalone page
2. THE System SHALL create client/income.html as a standalone page
3. THE System SHALL create employee/income.html as a standalone page
4. WHEN an income.html page is created, THE System SHALL include all necessary HTML structure (doctype, head, body, layout)
5. WHEN an income.html page is created, THE System SHALL include the same CSS dependencies as the corresponding finance.html page
6. WHEN an income.html page is created, THE System SHALL include the sidebar navigation component

### Requirement 2: Extract Income Functionality

**User Story:** As a developer, I want to move all Income-related code from finance.html to income.html, so that the Income page contains all necessary functionality.

#### Acceptance Criteria

1. WHEN the Income page is rendered, THE System SHALL display monthly income data from fees
2. WHEN the Income page is rendered, THE System SHALL calculate income based on ledger entries
3. WHEN the Income page is rendered, THE System SHALL group income data by month
4. WHEN the Income page is rendered, THE System SHALL display topup fees, platform fees, and setup/service fees separately
5. THE System SHALL include the renderIncomePage() function in income.html
6. THE System SHALL include all Income-related JavaScript functions in income.html
7. THE System SHALL include all Income-related CSS styles in income.html

### Requirement 3: Implement Page Tab Navigation

**User Story:** As a user, I want to navigate to the Income page using the page tabs, so that I can access Income data consistently with other Finance pages.

#### Acceptance Criteria

1. WHEN income.html is loaded, THE System SHALL display the page tabs navigation bar
2. WHEN income.html is loaded, THE System SHALL mark the Income tab as active
3. WHEN a user clicks on a page tab, THE System SHALL navigate to the corresponding page
4. THE System SHALL include tabs for: Topups, Finance, Income, Charges, Internal Transactions, and Transactions
5. WHEN a user clicks the Topups tab, THE System SHALL navigate to topups.html
6. WHEN a user clicks the Finance tab, THE System SHALL navigate to finance.html
7. WHEN a user clicks the Income tab, THE System SHALL navigate to income.html
8. WHEN a user clicks the Charges tab, THE System SHALL navigate to fees.html
9. WHEN a user clicks the Internal Transactions tab, THE System SHALL navigate to internal-transactions.html
10. WHEN a user clicks the Transactions tab, THE System SHALL navigate to transactions.html

### Requirement 4: Update Finance Page Navigation

**User Story:** As a user, I want the Income tab in finance.html to navigate to the new income.html page, so that I can access Income functionality from the Finance page.

#### Acceptance Criteria

1. WHEN finance.html is loaded, THE System SHALL display the Income tab in the page tabs navigation
2. WHEN a user clicks the Income tab in finance.html, THE System SHALL navigate to income.html
3. WHEN finance.html is loaded, THE System SHALL NOT mark the Income tab as active
4. THE System SHALL update the setActivePage() function in finance.html to handle Income navigation

### Requirement 5: Maintain Role-Specific Access

**User Story:** As a system administrator, I want each role to have access to their corresponding income.html page, so that users see role-appropriate Income data.

#### Acceptance Criteria

1. WHEN an admin user navigates to admin/income.html, THE System SHALL display admin-level Income data
2. WHEN a client user navigates to client/income.html, THE System SHALL display client-level Income data
3. WHEN an employee user navigates to employee/income.html, THE System SHALL display employee-level Income data
4. THE System SHALL apply the same role-based filtering to Income pages as exists in finance.html

### Requirement 6: Preserve Global Filters

**User Story:** As a user, I want to apply date range and client filters to Income data, so that I can view filtered Income information.

#### Acceptance Criteria

1. WHEN income.html is loaded, THE System SHALL display the global filters bar
2. WHEN a user selects a date range, THE System SHALL filter Income data by the selected dates
3. WHERE the user is an admin or employee, WHEN a user selects a client filter, THE System SHALL filter Income data by the selected client
4. WHEN a user clears filters, THE System SHALL reset Income data to show all records
5. THE System SHALL persist filter state when navigating between Finance section pages

### Requirement 7: Maintain Visual Consistency

**User Story:** As a user, I want the Income page to look consistent with other Finance pages, so that the interface feels cohesive.

#### Acceptance Criteria

1. WHEN income.html is loaded, THE System SHALL use the same header styling as other Finance pages
2. WHEN income.html is loaded, THE System SHALL use the same page tabs styling as other Finance pages
3. WHEN income.html is loaded, THE System SHALL use the same glass/liquid design system as other Finance pages
4. WHEN income.html is loaded, THE System SHALL use the same layout structure as other Finance pages
5. THE System SHALL apply the same theme toggle functionality to income.html

### Requirement 8: Remove Income Tab Content from Finance Page

**User Story:** As a developer, I want to remove Income-specific rendering code from finance.html, so that the Finance page only handles its own content.

#### Acceptance Criteria

1. WHEN finance.html is loaded, THE System SHALL NOT render Income tab content
2. THE System SHALL remove the renderIncomePage() function from finance.html
3. THE System SHALL remove Income-specific JavaScript code from finance.html
4. THE System SHALL keep the Income tab button in the page tabs navigation
5. THE System SHALL update the setActivePage() function to navigate to income.html instead of rendering Income content inline
