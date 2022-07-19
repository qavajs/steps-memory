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
        const val1 = await getValue(value1);
        const val2 = await getValue(value2);
        const validation: Function = getValidation(validationType);
        validation(val1, val2);
});

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
        const array = await getValue(arr);
        const val = await getValue(expectedValue);
        const validation: Function = getValidation(validationType);
        for (const value of array) {
           validation(await value, val);
        }
    }
);

/**
 * Save value to memory
 * @param {string} value
 * @param {string} key
 * @example I save 'value' to memory as 'key'
 */
When('I save {string} to memory as {string}', function (value, key) {
    memory.setValue(key, value);
});
