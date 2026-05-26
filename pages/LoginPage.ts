import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly adminRadioBtn: Locator;
  readonly userRadioBtn: Locator;
  readonly signInBtn: Locator;
  readonly loginForm: Locator;
  readonly okayBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.locator('#username');
    this.passwordField = page.locator('#password');
    this.adminRadioBtn = page.locator('input[value="admin"]');
    this.userRadioBtn = page.locator('input[value="user"]');
    this.signInBtn = page.locator('#signInBtn');
    this.loginForm = page.locator('#login-form');
    this.okayBtn = page.locator('#okayBtn');
  }

  /**
   * Navigate to the login page
   */
  async navigateToLoginPage(url: string): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify login page is displayed
   */
  async isLoginPageVisible(): Promise<boolean> {
    return await this.loginForm.isVisible();
  }

  /**
   * Enter username
   */
  async enterUsername(username: string): Promise<void> {
    await this.usernameField.fill(username);
  }

  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<void> {
    await this.passwordField.fill(password);
  }

  /**
   * Select user role (admin or user)
   * @param role - 'admin' or 'user'
   */
  async selectUserRole(role: 'admin' | 'user'): Promise<void> {
    const roleButton = role === 'admin' ? this.adminRadioBtn : this.userRadioBtn;
    
    if (await roleButton.isVisible()) {
      await roleButton.click();
      await this.page.waitForTimeout(300);
      
      // If user role is selected, a modal will appear - dismiss it
      if (role === 'user' && await this.okayBtn.isVisible()) {
        await this.okayBtn.click();
        await this.page.waitForTimeout(500);
      }
    }
  }

  /**
   * Click the sign-in button
   */
  async clickSignIn(): Promise<void> {
    await this.signInBtn.click();
  }

  /**
   * Complete login with all required steps
   */
  async login(username: string, password: string, role: 'admin' | 'user' = 'admin'): Promise<void> {
    await this.navigateToLoginPage('https://rahulshettyacademy.com/loginpagePractise/');
    
    if (!await this.isLoginPageVisible()) {
      throw new Error('Login page is not visible');
    }

    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.selectUserRole(role);
    await this.clickSignIn();
    
    // Wait for redirect to shop page
    await this.page.waitForURL('**/angularpractice/shop', { timeout: 15000 });
    await this.page.waitForLoadState('networkidle');
  }
}
