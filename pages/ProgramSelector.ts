import { Page, Locator } from '@playwright/test';
import { ProgramName } from '../data/programs';

export class ProgramSelector {

    private page: Page;
    private programDropdown: Locator;

    constructor(page: Page) {
        this.page = page;
        this.programDropdown = this.page.locator('[data-testid="program-picker-menu-select"]');
    }

    // Select program by value from ProgramName enum
    async selectProgram(programName: ProgramName) {
        await this.programDropdown.click();
        const programOption = this.page.locator(`ul[role="listbox"] li[data-testid="${programName}"]`);
        await programOption.click();
    }
}