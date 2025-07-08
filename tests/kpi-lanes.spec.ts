import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { loginForm } from '../data/login-form';

test.describe('Validate KPI Lanes table column totals', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigateTo();
        await loginPage.fillEmail(loginForm.validCredentials.email);
        await loginPage.fillPassword(loginForm.validCredentials.password);
        await loginPage.clickLogin();
    });

    test('Validate column totals in KPI Lanes table', async () => {
    });
});