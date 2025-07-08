import { Page, Locator, expect } from '@playwright/test';

export class SidebarMenu {

    private page: Page;
    private kpiSensorMenu: Locator;
    private fcmOptions: Locator;
    private lanesOption: Locator;
    private lanesHeader: Locator;

    constructor(page: Page) {
        this.page = page;
        // Locator for the KPI Sensor main menu button
        this.kpiSensorMenu = page.locator('[data-testid="KPI Sensor-drawer"]');
        // Locator for the FCM submenu under KPI Sensor
        this.fcmOptions = page.locator('[data-testid="FCM-drawer"]');
        // Locator for the Lanes option under FCM submenu
        this.lanesOption = page.locator('[data-testid="Lanes-drawer"]');
        // Locator for the header displayed after selecting Lanes (for validation)
        this.lanesHeader = page.locator('h6[data-testid="top-table-report-type-lanes"]');
    }

    // Click to open the KPI Sensor menu
    async openKpiSensor() {
        await this.kpiSensorMenu.click();
    }

    // Click to select the FCM submenu
    async selectFCM() {
        await this.fcmOptions.click();
    }

    // Click to select the Lanes option
    async selectLanes() {
        await this.lanesOption.click();
    }

    // Assert that the Lanes page header is visible and contains the word "lanes"
    async assertLanesHeaderVisible() {
        await expect(this.lanesHeader).toBeVisible();
        await expect(this.lanesHeader).toHaveText(/lanes/i);
    }

    // Navigate to KPI Sensors > FCM > Lanes and verify the page loaded
    async goToKpiSensorsSelectLanes() {
        await this.openKpiSensor();
        await this.selectFCM();
        await this.selectLanes();
        await this.assertLanesHeaderVisible();
    }
}