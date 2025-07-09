import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { loginForm } from '../data/login-form';

export async function loginToApp(page: Page) {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await loginPage.fillEmail(loginForm.validCredentials.email);
    await loginPage.fillPassword(loginForm.validCredentials.password);
    await loginPage.clickLogin();
}
