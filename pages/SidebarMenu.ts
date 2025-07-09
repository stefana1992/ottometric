import { Page, Locator, expect } from '@playwright/test';

export class SidebarMenu {

    private page: Page;
    private kpiSensorMenu: Locator;
    private fcmOptions: Locator;
    private lanesOption: Locator;
    private lanesHeader: Locator;
    private kpiFeatureMenu: Locator;
    private isaOptions: Locator;
    private zone1Option: Locator;
    private zone1Header: Locator;

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

        // Locator for the KPI Feature main menu button
        this.kpiFeatureMenu = page.locator('[data-testid="KPI Feature-drawer"]');

        // Locator for the ISA submenu under KPI Feature
        this.isaOptions = page.locator('[data-testid="ISA-drawer"]');

        // Locator for the Zone1 option under ISA submenu
        this.zone1Option = page.locator('[data-testid="Zone1-drawer"]');

        // Locator for the header displayed after selecting Zone1 (for validation)
        this.zone1Header = page.locator('h6[data-testid="top-table-report-type-zone1"]');
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

    // Click to open the KPI Feature menu
    async openKpiFeature() {
        await this.kpiFeatureMenu.click();
    }

    // Click to select the ISA submenu
    async selectIsa() {
        await this.isaOptions.click();
    }

    // Click to select the Zone1 option
    async selectZone1() {
        await this.zone1Option.click();
    }

    // Assert that the Zone1 page header is visible and contains the word "zone1"
    async assertZone1HeaderVisible() {
        await expect(this.zone1Header).toBeVisible();
        await expect(this.zone1Header).toHaveText(/zone1/i);
    }

    // Navigate to KPI Feature > ISA > Zone 1 and verify the page loaded
    async selectKpiFeatureIsaZone1() {
        await this.openKpiFeature();
        await this.selectIsa();
        await this.selectZone1();
        await this.assertZone1HeaderVisible();
    }
}