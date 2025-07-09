import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProgramSelector } from '../pages/ProgramSelector';
import { ProgramName } from '../data/programs';
import { SidebarMenu } from '../pages/SidebarMenu';
import { KpiLanesPage } from '../pages/KpiLanesPage';
import { loginToApp } from '../utils/testSetup';


test.describe('KPI Sensor - Lanes test', () => {

    let loginPage: LoginPage;
    let programSelector: ProgramSelector;
    let sidebarMenu: SidebarMenu;
    let kpiLanesPage: KpiLanesPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        programSelector = new ProgramSelector(page);
        sidebarMenu = new SidebarMenu(page);
        kpiLanesPage = new KpiLanesPage(page);

        //Login to the application
        await loginToApp(page);
    });

    test('Test 1: KPI Lanes - Validate column totals', async () => {
        //Select program 'Camera System VT1'
        await programSelector.selectProgram(ProgramName.VT1);

        //Go to KPI Sensors and select Lanes
        await sidebarMenu.goToKpiSensorsSelectLanes();

        // Validate that column averages match the totals within tolerance (default is 0.5%)
        await kpiLanesPage.checkColumnAveragesMatchTotals();

    });
});