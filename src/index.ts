import { Then, When } from '@cucumber/cucumber';
import memory from '@qavajs/memory';

/**
 * Verify that value from memory satisfies validation against other value
 * @param {any} value1 - first value
 * @param {Function} validation - validation
 * @param {any} value2 - second value
 * @example I expect '$value' equals to '$anotherValue'
 * @example I expect '$value' does not contain '56'
 */
Then('I expect {text} {validation} {text}', async function (value1: any, validation: Function, value2: any) {
    validation(await value1, await value2);
});

/**
 * Verify that every element in array satisfies validation against other value
 * @param {any} arr - arr
 * @param {Function} validation - validation
 * @param {any} value2 - expected value
 * @example I expect every element in '$arr' array to be above '$expectedValue'
 * @example I expect every element in '$arr' array to be above '50'
 */
Then(
    'I expect every element in {text} array {validation} {text}',
    async function (arr: any, validation: Function, expectedValue: any) {
       for (const value of await arr) {
           validation(await value, await expectedValue);
       }
    }
);

/**
 * Set memory value
 * @param {string} key
 * @param {string} value
 * @example I set 'key' = 'value'
 */
When('I set {string} = {string}', function (key, value) {
    memory.setValue(key, value);
});
