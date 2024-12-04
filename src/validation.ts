import { DataTable, Then } from '@cucumber/cucumber';
import { dataTable2Array } from './utils';
import { MemoryValue, Validation } from '@qavajs/core';

/**
 * Verify that value from memory satisfies validation against other value
 * @param {string} value1 - first value
 * @param {string} validation - validation
 * @param {string} value2 - second value
 * @example I expect '$value' equals to '$anotherValue'
 * @example I expect '$value' does not contain '56'
 */
Then(
    'I expect {value} {validation} {value}',
    async function (value1: MemoryValue, validation: Validation, value2: MemoryValue) {
        validation(await value1.value(), await value2.value());
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
    'I expect at least {int} element(s) in {value} array {validation} {value}',
    async function (expectedNumber: number, arr: MemoryValue, validation: Validation, expectedValue: MemoryValue) {
        const array: Array<any> = await arr.value();
        const val: any = await expectedValue.value();
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
            throw new Error(`Less than ${expectedNumber} pass validation`);
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
    'I expect every element in {value} array {validation} {value}',
    async function (arr: MemoryValue, validation: Validation, expectedValue: MemoryValue) {
        const array: Array<any> = await arr.value();
        const val: any = await expectedValue.value();
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
    'I expect {value} array to be sorted by {value}',
    async function (arr: MemoryValue, comparator: MemoryValue) {
        const array: Array<any> = await arr.value();
        if (!Array.isArray(array)) throw new Error(`'${arr}' is not an array`);
        const comparatorFn: (a: any, b: any) => number = await comparator.value();
        if (typeof comparatorFn !== 'function') throw new Error(`Comparator is not a implemented`);
        const arrayCopy: Array<any> = [...array];
        arrayCopy.sort(comparatorFn);
        const validation = this.validation('to deeply equal');
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
    'I expect {value} array {validation}:',
    async function (arr: MemoryValue, validation: Validation, members: DataTable) {
        const array = await arr.value();
        const membersArray = await Promise.all(
            members.raw().map(memberKey => this.getValue(memberKey.pop()))
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
    'I expect {value} {validation} at least one of {value}',
    async function (actual: MemoryValue, validation: Validation, expected: MemoryValue) {
        const actualValue = await actual.value();
        const expectedValues = await expected.value();
        if (!(expectedValues instanceof Array)) throw new Error(`'${expected.expression}' parameter is not an array`);
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
    'I expect {value} {validation} at least one of:',
    async function (actual: MemoryValue, validation: Validation, expected: DataTable) {
        const actualValue = await actual.value();
        const expectedValues = await dataTable2Array(this, expected);
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
    'I expect {value} {validation} all of {value}',
    async function (actual: MemoryValue, validation: Validation, expected: MemoryValue) {
        const actualValue = await actual.value();
        const expectedValues = await expected.value();
        if (!(expectedValues instanceof Array)) throw new Error(`'${expected.expression}' parameter is not an array`);
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
    'I expect {value} {validation} all of:',
    async function (actual: MemoryValue, validation: Validation, expected: DataTable) {
        const actualValue = await actual.value();
        const expectedValues = await dataTable2Array(this, expected);
        validateAllOf(actualValue, expectedValues, validation);
    }
);

