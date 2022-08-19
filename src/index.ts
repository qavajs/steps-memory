import { Then, When } from '@cucumber/cucumber';
import memory from '@qavajs/memory';
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
 * Save result of math expression and save result to memory
 * @param expression - string expression
 * @param key - key to store value
 * @example When I save result of math expression '{$variable} + 42' as 'result'
 * @example When I save result of math expression '{$random()} * 100' as 'result'
 */
When(
    'I save result of math expression {string} as {string}',
    async function (expression: string, key: string) {
        const resolvedExpression: string = await getValue(expression);
        const exprFn = new Function('return ' + resolvedExpression);
        memory.setValue(key, exprFn);
    }
);

/**
 * Save value to memory
 * @param {string} value
 * @param {string} key
 * @example I save 'value' to memory as 'key'
 */
When('I save {string} to memory as {string}', function (value: string, key: string) {
    memory.setValue(key, value);
});
