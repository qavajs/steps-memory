import { Then } from '@cucumber/cucumber';

/**
 * Validate that value1
 * @example I expect '$value' equals to '$anotherValue'
 * @example I expect '$value' does not contain '56'
 */
Then('I expect {text} {validation} {text}', async function (value1: any, validation: Function, value2: any) {
    validation(await value1, await value2);
});

/**
 * Verify that every element in array satisfy validation
 */
Then('I expect every element in {text} array {compareValidation} {text}', async function (arr: any, validation: Function, expectedValue: any) {
   for (const value of await arr) {
       validation(await value, await expectedValue);
   }
});
