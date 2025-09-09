import { DataTable } from '@qavajs/core';

/**
 * Transform key-value data table to JS object
 * @param context
 * @param dataTable
 * @return {Object}
 */
export async function dataTable2Object(context: any, dataTable: DataTable): Promise<{ [key: string]: string }> {
    const obj: { [key: string]: string } = {};
    for (const [key, value] of dataTable.raw()) {
        obj[key] = await context.getValue(value);
    }
    return obj;
}

/**
 * Transform key-value data table to array
 * @param context
 * @param dataTable
 * @return {any[]}
 */
export function dataTable2Array(context: any, dataTable: DataTable): Promise<any[]> {
    return Promise.all(dataTable.raw().map(([value]) => context.getValue(value)));
}
