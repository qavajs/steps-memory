import memory from '@qavajs/memory';
import { DataTable } from '@cucumber/cucumber';

/**
 * Transform key-value data table to JS object
 * @param dataTable
 * @return {Object}
 */
export async function dataTable2Object(dataTable: DataTable): Promise<{ [key: string]: string }> {
    const obj: { [key: string]: string } = {};
    for (const [key, value] of dataTable.raw()) {
        obj[key] = await memory.getValue(value);
    }
    return obj;
}
