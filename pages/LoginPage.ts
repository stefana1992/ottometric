import { expect, Page, Locator } from '@playwright/test';

// Page Object Model for the Login Page
export class LoginPage {
    private page: Page;
    private emailInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Locator for the email input field
        this.emailInput = this.page.locator('input[name="email"]');
        // Locator for the password input field
        this.passwordInput = this.page.locator('input[name="password"]');
        // Locator for the login button
        this.loginButton = this.page.locator("[data-testid='otto-login-btn']");
    }

    // Navigate to the login page
    async navigateTo() {
        await this.page.goto('/');
    }

    // Fill in the email input field
    async fillEmail(email: string) {
        await this.emailInput.fill(email);
    }

    // Fill in the password input field
    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    // Click the login button
    async clickLogin() {
        await this.loginButton.click();
    }

}