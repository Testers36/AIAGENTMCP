import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('LoginPage Tests', () => {
  let loginPage: LoginPage;

  // Test credentials
  const credentials = {
    username: 'rahulshettyacademy',
    password: 'Learning@830$3mK2',
  };

  const loginUrl = 'https://rahulshettyacademy.com/loginpagePractise/';

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('Should display login page', async () => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLoginPage(loginUrl);
    });

    await test.step('Verify login form is visible', async () => {
      const isVisible = await loginPage.isLoginPageVisible();
      expect(isVisible).toBe(true);
      console.log('✓ Login page is displayed');
    });
  });

  test('Should fill username field correctly', async () => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLoginPage(loginUrl);
    });

    await test.step('Enter username', async () => {
      await loginPage.enterUsername(credentials.username);
      const username = await loginPage.usernameField.inputValue();
      expect(username).toBe(credentials.username);
      console.log('✓ Username entered successfully');
    });
  });

  test('Should fill password field correctly', async () => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLoginPage(loginUrl);
    });

    await test.step('Enter password', async () => {
      await loginPage.enterPassword(credentials.password);
      const password = await loginPage.passwordField.inputValue();
      expect(password).toBe(credentials.password);
      console.log('✓ Password entered successfully');
    });
  });

  test('Should select admin role', async () => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLoginPage(loginUrl);
    });

    await test.step('Select admin role', async () => {
      await loginPage.selectUserRole('admin');
      const isAdminSelected = await loginPage.adminRadioBtn.isChecked();
      expect(isAdminSelected).toBe(true);
      console.log('✓ Admin role selected');
    });
  });

  test('Should select user role and handle modal', async () => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLoginPage(loginUrl);
    });

    await test.step('Select user role', async () => {
      await loginPage.selectUserRole('user');
      const isUserSelected = await loginPage.userRadioBtn.isChecked();
      expect(isUserSelected).toBe(true);
      console.log('✓ User role selected and modal handled');
    });
  });

  test('Should successfully login with admin role', async () => {
    await test.step('Complete login process', async () => {
      await loginPage.login(credentials.username, credentials.password, 'admin');
    });

    await test.step('Verify redirect to shop page', async () => {
      expect(loginPage.page.url()).toContain('shop');
      console.log('✓ Successfully logged in and redirected to shop');
    });
  });

  test('Should successfully login with user role', async () => {
    await test.step('Complete login process', async () => {
      await loginPage.login(credentials.username, credentials.password, 'user');
    });

    await test.step('Verify redirect to shop page', async () => {
      expect(loginPage.page.url()).toContain('shop');
      console.log('✓ Successfully logged in with user role');
    });
  });

  test('Should show error with empty credentials', async () => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLoginPage(loginUrl);
    });

    await test.step('Try to login with empty fields', async () => {
      await loginPage.clickSignIn();
      
      // Check for error message
      const errorMessage = loginPage.page.locator('.alert-danger');
      const isErrorVisible = await errorMessage.isVisible().catch(() => false);
      expect(isErrorVisible).toBe(true);
      console.log('✓ Error message displayed for empty credentials');
    });
  });

  test('Should show error with invalid password', async () => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLoginPage(loginUrl);
    });

    await test.step('Enter username and invalid password', async () => {
      await loginPage.enterUsername(credentials.username);
      await loginPage.enterPassword('wrongpassword');
      await loginPage.clickSignIn();
      
      // Wait for error message
      await loginPage.page.waitForTimeout(2500);
      
      const errorMessage = loginPage.page.locator('.alert-danger');
      const isErrorVisible = await errorMessage.isVisible().catch(() => false);
      expect(isErrorVisible).toBe(true);
      console.log('✓ Error message displayed for invalid password');
    });
  });

  test('Login page should have all required elements', async () => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLoginPage(loginUrl);
    });

    await test.step('Verify all form elements exist', async () => {
      expect(await loginPage.usernameField.isVisible()).toBe(true);
      expect(await loginPage.passwordField.isVisible()).toBe(true);
      expect(await loginPage.signInBtn.isVisible()).toBe(true);
      expect(await loginPage.loginForm.isVisible()).toBe(true);
      console.log('✓ All required login elements are visible');
    });
  });
});
