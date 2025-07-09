import { Page, Locator, expect } from '@playwright/test';

export class KpiZone1Page {
    private page: Page;
    private falseSortButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.falseSortButton = page.locator('[data-testid="Zone1-FALSE"] button[data-testid^="sorting-"]');
    }

    async sortTableByFalse() {
        await this.falseSortButton.scrollIntoViewIfNeeded();
        await this.falseSortButton.click();
    }

    async openFirstSevenDtidsAndCountFnEventsInTimeline() {
        // Filter the FN column by "Count" to prepare the table view
        await this.filterFnColumnByCount();

        // Locate all rows in the center and left tables
        const centerRows = this.page.locator('table[data-testid="table-center"] tr');
        const leftRows = this.page.locator('table[data-testid="table-left"] tbody tr');
        const totalRows = await centerRows.count();

        // Define the starting index (skip headers) and determine how many rows to check (max 7)
        const startIndex = 2;
        const rowsToCheck = Math.min(totalRows - startIndex, 7);

        // Iterate over each of the selected DTID rows
        for (let i = 0; i < rowsToCheck; i++) {
            const centerRow = centerRows.nth(startIndex + i); // FN count row
            const leftRow = leftRows.nth(i); // Corresponding row with checkbox

            // Extract FN count value from the last cell in the center row
            const fnCount = await this.getFnCountFromTable(centerRow);
            console.log(`Row ${i + 1} (table), FN count from table: ${fnCount}`);

            // Open the timeline page for the current row (DTID)
            const newPage = await this.openTimelineDetailsForRow(leftRow);

            // Count FN events in the timeline from the newly opened page
            const totalEvents = await this.countFnEventsFromTimeline(newPage, i + 1);
            console.log(`Row ${i + 1}, Total FN events: ${totalEvents}`);

            // Assert that the number of FN events matches the count in the table
            expect(totalEvents).toBe(fnCount);

            // Close the timeline page and uncheck the row
            await newPage.close();
            await this.uncheckRow(leftRow);
        }
    }

    private async filterFnColumnByCount() {
        // Locate the last column header in the last header row (assumed to be FN column)
        const fnColumn = this.page.locator('table thead tr').last().locator('td, th').last();
        await fnColumn.hover(); // Hover to reveal the options menu

        // Click on the three dots (MoreVertIcon) to open column options
        const threeDots = fnColumn.locator('[data-testid="MoreVertIcon"]');
        await threeDots.click();

        // Select the "Count" option to filter FN values in the column
        const countOption = this.page.locator('[data-testid="highlight-Zone1Present-FN"]');
        await countOption.waitFor({ state: 'visible' }); // Ensure option is visible before clicking
        await countOption.click(); // Apply the count-based filtering
    }

    private async getFnCountFromTable(row: Locator): Promise<number> {
        // Locate the last <td> cell in the given row (it contains FN count)
        const fnCell = row.locator('td').last();

        // Extract the text content from the FN cell
        const fnText = await fnCell.textContent();

        // Parse the text into a number, defaulting to 0 if empty or undefined
        return parseInt(fnText?.trim() || '0', 10);
    }


    private async openTimelineDetailsForRow(row: Locator): Promise<Page> {
        // Check the checkbox in the given row to enable details button
        const checkbox = row.locator('input[type="checkbox"]');
        await checkbox.check({ force: true });

        // Wait for the "See Details" button to become visible
        const seeDetailsBtn = this.page.locator('[data-testid="sendToDetails"]');
        await seeDetailsBtn.waitFor({ state: 'visible' });

        // Click "See Details" and wait for the new page to open
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            seeDetailsBtn.click(),
        ]);

        // Wait until the new page finishes loading
        await newPage.waitForLoadState('load');

        // Ensure the timeline component is visible on the new page
        await this.ensureTimelineVisible(newPage);

        // Return the new page instance for further actions
        return newPage;
    }

    private async ensureTimelineVisible(page: Page) {
        // Try to wait for the timeline container to appear within 10 seconds
        try {
            await page.waitForSelector('.timeline', { timeout: 10000 });
            console.log('Timeline is visible after waiting.');
        } catch {
            // If timeline not visible, open Preview menu and activate Timeline view manually
            console.log('Timeline NOT visible, activating via Preview menu...');
            const previewIcons = page.locator('[data-testid="PreviewIcon"]');
            await previewIcons.nth(2).click();

            const timelineOption = page.locator('[data-testid^="viewportMenuItem-Timeline"]');
            await timelineOption.click();

            // Wait again for the timeline container to appear
            await page.waitForSelector('.timeline', { timeout: 10000 });
        }
    }


    private async countFnEventsFromTimeline(page: Page, rowIndex: number): Promise<number> {
        // Get all timeline labels and groups on the page
        const labelElements = await page.$$('.vis-label');
        const groupElements = await page.$$('.vis-foreground .vis-group');

        // Find the index of the label that contains "FN"
        let fnIndex = -1;
        for (let j = 0; j < labelElements.length; j++) {
            const labelText = (await labelElements[j].innerText()).trim();
            if (labelText.includes('FN')) {
                fnIndex = j;
                break;
            }
        }

        // Get the corresponding timeline group for the "FN" label
        const fnGroup = groupElements[fnIndex];

        // Get all timeline event items within the FN group
        const items = await fnGroup.$$('.vis-item.timeline-item');
        let total = 0;

        // Iterate through each event item and sum their counts
        for (const item of items) {
            const content = await item.$('.vis-item-content');
            const text = (await content?.innerText())?.trim() || '';
            // If text is empty or not a number, count as 1 event, otherwise add the numeric value
            total += (!text || isNaN(Number(text))) ? 1 : Number(text);
        }

        // Return the total number of FN events counted
        return total;
    }

    // Unchecks the checkbox in the given row
    private async uncheckRow(row: Locator) {
        const checkbox = row.locator('input[type="checkbox"]');
        await checkbox.uncheck({ force: true });
    }
}