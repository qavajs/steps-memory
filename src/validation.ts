import { DataTable, Then } from '@cucumber/cucumber';
import { getValidation } from '@qavajs/validation';
import { getValue } from './transformers';

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
        const validation: Function = getValidation(validationType);
        validation(val1, val2);
    });

/**
 * Verify that at least x elements in array pass validation
 * @param {string} arr - arr
 * @param {string} validation - validation
 * @param {string} expectedValue - expected value
 * @example I expect at least 1 element(s) in '$arr' array to be above '$expectedValue'
 * @example I expect at least 2 element(s) in '$arr' array to be above '50'
 */
Then(
    'I expect at least {int} elements in {string} array {memoryValidation} {string}',
    async function (expectedNumber: number, arr: string, validationType: string, expectedValue: string) {
        const array: Array<any> = await getValue(arr);
        const val: any = await getValue(expectedValue);
        const validation: Function = getValidation(validationType);
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
        const validation: Function = getValidation(validationType);
        for (const value of array) {
            validation(await value, val);
        }
    }
);

/**
 * Verify that array is sorted by
 * @param {string} arr - memory key of array
 * @param {string} comparator - memory key of sort comparator function https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description
 * @example I expect '$arr' array to be sorted by '$ascending'
 */
Then(
    'I expect {string} array to be sorted by {string}',
    async function (arr: string, comparator: string) {
        const array: Array<any> = await getValue(arr);
        if (!Array.isArray(array)) throw new Error(`'${arr}' is not an array`);
        const comparatorFn: (a: any, b: any) => number = await getValue(comparator);
        const arrayCopy: Array<any> = [...array];
        arrayCopy.sort(comparatorFn);
        const validation: Function = getValidation('to deeply equal');
        validation(array, arrayCopy);
    }
);

/**
 * Verify that array value from memory satisfies validation against other array in form of data table
 * @param {string} arr - memory key of array
 * @param {string} validation - validation
 * @param {DataTable} - expected array
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
        const validation: Function = getValidation(validationType);
        const membersArray = await Promise.all(
            members.raw().map(memberKey => getValue(memberKey.pop() as string))
        );
        validation(array, membersArray);
    }
);

