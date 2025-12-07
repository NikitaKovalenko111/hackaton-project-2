# E2E Test IDs Reference

This document lists all `data-testid` attributes added to the application for end-to-end testing.

## Authentication

### Login Form (`/auth`)
- `login-form-container` - Main login form container
- `login-form-title` - Login form title
- `login-switch-to-signup-button` - Button to switch to signup form
- `login-email-input` - Email input field
- `login-password-input` - Password input field
- `login-submit-button` - Login submit button

### Signup Form (`/auth`)
- `signup-form-container` - Main signup form container
- `signup-form-title` - Signup form title
- `signup-switch-to-login-button` - Button to switch to login form
- `signup-name-input` - Name input field
- `signup-surname-input` - Surname input field
- `signup-email-input` - Email input field
- `signup-password-input` - Password input field
- `signup-submit-button` - Signup submit button

### Auth Card
- `auth-card` - Main authentication card container

## Company Management

### Create Company Form (`/company`)
- `create-company-form-container` - Company creation form container
- `create-company-name-input` - Company name input field
- `create-company-submit-button` - Create company submit button
- `create-company-back-button` - Back button

### Greet Card
- `greet-card` - Main greet card container
- `greet-card-title` - Greet card title
- `greet-create-company-button` - Button to create company
- `greet-logout-button` - Logout button

## Employee Management

### Employees Page (`/employees`)
- `employees-page` - Main employees page container
- `employees-surname-search-input` - Surname search input
- `employees-name-search-input` - Name search input
- `employees-add-button` - Add employee button

### Add Employee Dialog
- `add-employee-dialog` - Add employee dialog container
- `add-employee-title` - Dialog title
- `add-employee-email-input` - Email input field
- `add-employee-role-select` - Role select dropdown
- `add-employee-role-trigger` - Role select trigger button
- `add-employee-cancel-button` - Cancel button
- `add-employee-submit-button` - Submit button

### Employees Table
- `employees-table-container` - Employees table container
- `employee-edit-button-{id}` - Edit employee button (dynamic ID)
- `employee-delete-button-{id}` - Delete employee button (dynamic ID)
- `employees-table-previous-button` - Previous page button
- `employees-table-next-button` - Next page button

### Confirm Delete Employee Dialog
- `confirm-delete-employee-dialog` - Confirmation dialog container
- `confirm-delete-employee-title` - Dialog title
- `confirm-delete-employee-cancel` - Cancel button
- `confirm-delete-employee-confirm` - Confirm delete button

## Team Management

### Teams Page (`/teams`)
- `teams-page` - Main teams page container
- `teams-name-search-input` - Team name search input
- `teams-teamlead-search-input` - Teamlead surname search input
- `teams-add-button` - Add team button

### Add Team Dialog
- `add-team-dialog` - Add team dialog container
- `add-team-title` - Dialog title
- `add-team-name-input` - Team name input field
- `add-team-desc-input` - Team description input field
- `add-team-teamlead-select` - Teamlead select dropdown
- `add-team-teamlead-trigger` - Teamlead select trigger button
- `add-team-cancel-button` - Cancel button
- `add-team-submit-button` - Submit button

### Teams Table
- `teams-table-container` - Teams table container
- `team-delete-button-{id}` - Delete team button (dynamic ID)
- `teams-table-previous-button` - Previous page button
- `teams-table-next-button` - Next page button

### Confirm Delete Team Dialog
- `confirm-delete-team-dialog` - Confirmation dialog container
- `confirm-delete-team-title` - Dialog title
- `confirm-delete-team-cancel` - Cancel button
- `confirm-delete-team-confirm` - Confirm delete button

## Skills Management

### Skills Page (`/skills-settings`)
- `skills-page` - Main skills page container
- `skills-search-input` - Skill name search input
- `skills-add-button` - Add skill button

### Create Skill Dialog
- `create-skill-dialog` - Create skill dialog container
- `create-skill-title` - Dialog title
- `create-skill-name-input` - Skill name input field
- `create-skill-desc-input` - Skill description input field
- `create-skill-cancel-button` - Cancel button
- `create-skill-submit-button` - Submit button

### Create Order Dialog
- `create-order-dialog` - Create order dialog container
- `create-order-title` - Dialog title
- `create-order-skill-select` - Skill select dropdown
- `create-order-skill-trigger` - Skill select trigger button
- `create-order-level-select` - Level select dropdown
- `create-order-level-trigger` - Level select trigger button
- `create-order-remove-criterion-button` - Remove criterion button
- `create-order-add-criterion-button` - Add criterion button
- `create-order-cancel-button` - Cancel button
- `create-order-submit-button` - Submit button

### Skills Table
- `skills-table-container` - Skills table container
- `skill-edit-button-{id}` - Edit skill button (dynamic ID)
- `skill-delete-button-{id}` - Delete skill button (dynamic ID)
- `skills-table-previous-button` - Previous page button
- `skills-table-next-button` - Next page button

### Skill Orders Page
- `skill-orders-page` - Skill orders page container

### Confirm Delete Skill Dialog
- `confirm-delete-skill-dialog` - Confirmation dialog container
- `confirm-delete-skill-title` - Dialog title
- `confirm-delete-skill-cancel` - Cancel button
- `confirm-delete-skill-confirm` - Confirm delete button

## Navigation

### App Sidebar
- `nav-link-{path}` - Navigation link (dynamic path, e.g., `nav-link--main`, `nav-link--employees`)

### App Header
- `app-header` - Main header container
- `app-logo` - Application logo/title
- `notifications-button` - Notifications bell icon button
- `notification-mark-read-{id}` - Mark notification as read button (dynamic ID)
- `profile-link` - Profile link button

## Profile

### Profile Page (`/profile`)
- `profile-page` - Main profile page container

### Profile Tabs
- `profile-personal-tab` - Personal information tab
- `profile-skills-tab` - Skills tab
- `profile-team-tab` - Team tab
- `profile-requests-tab` - Requests tab (for teamleads/techleads)

## Interviews

### Interviews Page (`/interviews`)
- `interviews-page` - Main interviews page container

## Usage Examples

### Example E2E Test (Playwright/Cypress)

```typescript
// Login test
await page.goto('/auth');
await page.getByTestId('login-email-input').fill('user@example.com');
await page.getByTestId('login-password-input').fill('password123');
await page.getByTestId('login-submit-button').click();

// Add employee test
await page.goto('/employees');
await page.getByTestId('employees-add-button').click();
await page.getByTestId('add-employee-email-input').fill('new@example.com');
await page.getByTestId('add-employee-role-trigger').click();
// Select role from dropdown
await page.getByTestId('add-employee-submit-button').click();

// Navigate to teams (note: single dash after 'link')
await page.getByTestId('nav-link--teams').click();
```

## Notes

- Dynamic IDs (with `{id}` placeholder) are replaced with actual entity IDs at runtime
- All test IDs follow the pattern: `{component}-{action}-{element}`
- Search inputs and filters have descriptive test IDs for easy identification
- All confirmation dialogs have consistent naming patterns
