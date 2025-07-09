import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProgramSelector } from '../pages/ProgramSelector';
import { SidebarMenu } from '../pages/SidebarMenu';
import { ProgramName } from '../data/programs';
import { KpiZone1Page } from '../pages/KpiZone1Page';
import { loginToApp } from '../utils/testSetup';


test.describe('KPI Feature - Zone1 test', () => {
    let loginPage: LoginPage;
    let programSelector: ProgramSelector;
    let sidebarMenu: SidebarMenu;
    let kpiZone1Page: KpiZone1Page;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        programSelector = new ProgramSelector(page);
        sidebarMenu = new SidebarMenu(page);
        kpiZone1Page = new KpiZone1Page(page);

        //Login to the application
        await loginToApp(page);
    });

    test('Test 2: Count FN events for first 7 DTIDs sorted by False', async () => {
        //Select program "Camera System VI1"
        await programSelector.selectProgram(ProgramName.VI1);

        // Navigate through sidebar to KPI Feature > ISA > Zone1
        await sidebarMenu.selectKpiFeatureIsaZone1();

        // Sort table by False
        await kpiZone1Page.sortTableByFalse();

        // Open first seven DTIDs and count FN events in timeline
        await kpiZone1Page.openFirstSevenDtidsAndCountFnEventsInTimeline();
    });
});