import { Page, Locator, expect } from '@playwright/test';

export class KpiLanesPage {
    
    private page: Page;
    private table: Locator;

    constructor(page: Page) {
        this.page = page;
        this.table = page.locator('table[data-testid="table-center"]');
    }

    // Wait until the Lanes table body is loaded
    async waitForTable() {
        await this.page.waitForSelector('table[data-testid="table-center"] tbody tr');
        await expect(this.table).toBeVisible();
    }

    private async getColumnValues(columnIndex: number): Promise<number[]> {
        const values: number[] = [];
        const bodyRows = this.table.locator('tbody tr');
        const rowCount = await bodyRows.count();

        // Iterate over each row to extract the value in the specified column
        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            // Get the cell in the current row at the given column index
            const cell = bodyRows.nth(rowIndex).locator('td').nth(columnIndex);

            const rawText = await cell.textContent();
            // Trim the text to remove any leading/trailing whitespace, fallback to empty string if nul
            const text = (rawText ? rawText.trim() : '');


            if (text.endsWith('%')) {
                // Trim the text to remove any leading/trailing whitespace, fallback to empty string if nul
                const value = parseFloat(text.replace('%', ''));
                // Check if the parsed value is a valid number, then add to array
                if (!isNaN(value)) {
                    values.push(value);
                }
            }
        }
        // Return an array of numeric percentage values (without the '%' sign)
        return values;
    }

    // Get total percentage value from footer row for a specified column index
    private async getTotalValue(columnIndex: number): Promise<number | null> {
        const totalRow = this.table.locator('tfoot tr').first();
        const totalCell = totalRow.locator('td').nth(columnIndex);
        // Get the raw text content of the total cell
        const rawTotalText = await totalCell.textContent();
        const totalText = rawTotalText ? rawTotalText.trim() : '';

        if (totalText.endsWith('%')) {
            // Remove the '%' sign and parse the remaining text as a float number
            const totalValue = parseFloat(totalText.replace('%', ''));
            // Return the number if it is a valid numeric value
            if (!isNaN(totalValue)) {
                return totalValue;
            }
        }
        // Return null if total value is missing or invalid
        return null;
    }

    async checkColumnAveragesMatchTotals(tolerancePercent: number = 0.5) {
        // Wait for the table to be fully loaded and visible
        await this.waitForTable();
        const totalRow = this.table.locator('tfoot tr').first();
        // Get the number of columns in the total row
        const colCount = await totalRow.locator('td').count();

        // Iterate over each column index to validate the averages
        for (let colIndex = 0; colIndex < colCount; colIndex++) {
            const values = await this.getColumnValues(colIndex);


            // If there are no valid percentage values in this column, log a warning and skip it
            if (values.length === 0) {
                console.warn(`Column ${colIndex + 1} has no valid percentage values.`);
                continue;
            }

            // Calculate the average value for the column
            let sum = 0;
            for (const v of values) {
                sum += v;
            }
            const average = sum / values.length;

            // Retrieve the total percentage value from the footer for this column
            const totalValue = await this.getTotalValue(colIndex);

            // If total value is missing or invalid, log a warning and skip this column
            if (totalValue === null) {
                console.warn(`Column ${colIndex + 1} has no valid total value.`);
                continue;
            }

            // Calculate the absolute difference between average and total
            const diff = Math.abs(average - totalValue);
            const status = diff <= tolerancePercent ? 'PASS' : 'FAIL';

            // Log detailed info for debugging and reporting
            console.log(
                `Column ${colIndex + 1}: Average = ${average.toFixed(2)}%, Total = ${totalValue}%, ` +
                `Difference = ${diff.toFixed(2)}%, Status: ${status}`
            );

            //  Assert the difference does not exceed the allowed tolerance
            // causing the test to fail if the condition is not met
            expect(diff, `Column ${colIndex + 1} average differs from total by more than ${tolerancePercent}%`).toBeLessThanOrEqual(tolerancePercent);
        }
    }

}