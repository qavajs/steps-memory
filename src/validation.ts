import { DataTable, Then } from '@cucumber/cucumber';
import { getValidation } from '@qavajs/validation';
import { getValue } from './transformers';
import { dataTable2Array } from './utils';

/**
 * Verify that value from memory satisfies validation against other value
 * @param {string} value1 - first value
 * @param {string} validation - validation
 * @param {string} value2 - second value
 * @example I expect '$value' equals to '$anotherValue'
 * @example I expect '$value' does not contain '56'
 */
Then(
    'I expect {string} {memoryValidation} {string}',
    async function (value1: string, validationType: string, value2: string) {
        const val1: any = await getValue(value1);
        const val2: any = await getValue(value2);
        const validation = getValidation(validationType);
        validation(val1, val2);
    });

/**
 * Verify that at least x elements in array pass validation
 * @param {string} arr - arr
 * @param {string} validation - validation
 * @param {string} expectedValue - expected value
 * @example I expect at least 1 element in '$arr' array to be above '$expectedValue'
 * @example I expect at least 2 elements in '$arr' array to be above '50'
 */
Then(
    'I expect at least {int} element(s) in {string} array {memoryValidation} {string}',
    async function (expectedNumber: number, arr: string, validationType: string, expectedValue: string) {
        const array: Array<any> = await getValue(arr);
        const val: any = await getValue(expectedValue);
        const validation = getValidation(validationType);
        const failCounter = { fail: 0, pass: 0 };
        for (const value of array) {
            try {
                validation(await value, val);
                failCounter.pass++;
            } catch (err) {
                failCounter.fail++;
            }
        }
        if (failCounter.pass < expectedNumber) {
            throw new Error(`Less than ${expectedNumber} pass ${validationType} verification`);
        }
    }
);

/**
 * Verify that every element in array satisfies validation against other value
 * @param {string} arr - arr
 * @param {string} validation - validation
 * @param {string} expectedValue - expected value
 * @example I expect every element in '$arr' array to be above '$expectedValue'
 * @example I expect every element in '$arr' array to be above '50'
 */
Then(
    'I expect every element in {string} array {memoryValidation} {string}',
    async function (arr: string, validationType: string, expectedValue: string) {
        const array: Array<any> = await getValue(arr);
        const val: any = await getValue(expectedValue);
        const validation = getValidation(validationType);
        for (const value of array) {
            validation(await value, val);
        }
    }
);

/**
 * Verify that array is sorted by
 * @param {string} arr - memory key of array
 * @param {string} comparator - memory key of sort comparator function https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description
 * Important: This module does not include implementation of sorting function,
 * as it may have various implementations for different types of compared data
 * @example I expect '$arr' array to be sorted by '$ascending'
 */
Then(
    'I expect {string} array to be sorted by {string}',
    async function (arr: string, comparator: string) {
        const array: Array<any> = await getValue(arr);
        if (!Array.isArray(array)) throw new Error(`'${arr}' is not an array`);
        const comparatorFn: (a: any, b: any) => number = await getValue(comparator);
        if (typeof comparatorFn !== 'function') throw new Error(`'${comparator}' is not implemented`);
        const arrayCopy: Array<any> = [...array];
        arrayCopy.sort(comparatorFn);
        const validation = getValidation('to deeply equal');
        validation(array, arrayCopy);
    }
);

/**
 * Verify that array value from memory satisfies validation against other array in form of data table
 * @param {string} arr - memory key of array
 * @param {string} validation - validation
 * @param {DataTable} expected - expected array
 * @example
 * When I expect '$arr' array to have members:
 *  | uno  |
 *  | dos  |
 *  | tres |
 */
Then(
    'I expect {string} array {memoryValidation}:',
    async function (arr: string, validationType: string, members: DataTable) {
        const array = await getValue(arr);
        const validation = getValidation(validationType);
        const membersArray = await Promise.all(
            members.raw().map(memberKey => getValue(memberKey.pop() as string))
        );
        validation(array, membersArray);
    }
);

function validateAnyOf(AR: any, ERs: any[], validation: (AR: any, ER: any) => void){
    const errorCollector: Error[] = [];
    for (const ER of ERs) {
        try {
            validation(AR, ER);
            return;
        } catch (err) {
            errorCollector.push(err as Error);
        }
    }
    throw new Error(errorCollector.map(err => err.message).join('\n'));
}

/**
 * Verify that the value satisfies validation with at least one value from the array
 * @param {string} actual - value to verify
 * @param {string} validation - validation
 * @param {string} expected - array of expected values
 * @example
 * When I expect '$text' to equal at least one of '$js(["free", "11.99"])'
 */
Then(
    'I expect {string} {memoryValidation} at least one of {string}',
    async function (actual: string, validationType: string, expected: string) {
        const actualValue = await getValue(actual);
        const expectedValues = await getValue(expected);
        if (!(expectedValues instanceof Array)) throw new Error(`'${expected}' parameter is not an array`);
        const validation = getValidation(validationType);
        validateAnyOf(actualValue, expectedValues, validation);
    }
);

/**
 * Verify that the value satisfies validation with at least one value from the array
 * @param {string} actual - value to verify
 * @param {string} validation - validation
 * @param {string} expected - array of expected values
 * @example
 * When I expect '$text' to equal at least one of:
 *     | free  |
 *     | 11.99 |
 */
Then(
    'I expect {string} {memoryValidation} at least one of:',
    async function (actual: string, validationType: string, expected: DataTable) {
        const actualValue = await getValue(actual);
        const expectedValues = await dataTable2Array(expected);
        const validation = getValidation(validationType);
        validateAnyOf(actualValue, expectedValues, validation);
    }
);

function validateAllOf(AR: any, ERs: any[], validation: (AR: any, ER: any) => void){
    const errorCollector: Error[] = [];
    for (const ER of ERs) {
        try {
            validation(AR, ER);
        } catch (err) {
            errorCollector.push(err as Error);
        }
    }
    if (errorCollector.length > 0) {
        throw new Error(errorCollector.map(err => err.message).join('\n'));
    }
}

/**
 * Verify that the value satisfies validation with all values from the array
 * @param {string} actual - value to verify
 * @param {string} validation - validation
 * @param {string} expected - array of expected values
 * @example
 * When I expect '$text' not to equal all of '$js(["free", "10.00"])'
 */
Then(
    'I expect {string} {memoryValidation} all of {string}',
    async function (actual: string, validationType: string, expected: string) {
        const actualValue = await getValue(actual);
        const expectedValues = await getValue(expected);
        if (!(expectedValues instanceof Array)) throw new Error(`'${expected}' parameter is not an array`);
        const validation = getValidation(validationType);
        validateAllOf(actualValue, expectedValues, validation);
    }
);

/**
 * Verify that the value satisfies validation with all values from the array
 * @param {string} actual - value to verify
 * @param {string} validation - validation
 * @param {string} expected - array of expected values
 * @example
 * When I expect '$text' not to equal all of:
 *    | free  |
 *    | 10.00 |
 */
Then(
    'I expect {string} {memoryValidation} all of:',
    async function (actual: string, validationType: string, expected: DataTable) {
        const actualValue = await getValue(actual);
        const expectedValues = await dataTable2Array(expected);
        const validation = getValidation(validationType);
        validateAllOf(actualValue, expectedValues, validation);
    }
);

