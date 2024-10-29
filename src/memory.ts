import { DataTable, When } from '@cucumber/cucumber';
import { dataTable2Object } from './utils';
import { MemoryValue } from '@qavajs/core';

/**
 * Save result of math expression and save result to memory
 * @param expression - string expression
 * @param key - key to store value
 * @example When I save result of math expression '{$variable} + 42' as 'result'
 * @example When I save result of math expression '{$random()} * 100' as 'result'
 */
When(
    'I save result of math expression {value} as {value}',
    async function (expression: MemoryValue, key: MemoryValue) {
        const exprFn = new Function('return ' + await expression.value());
        key.set(exprFn());
    }
);

/**
 * Save value to memory
 * @param {string} alias - value to save or alias for previously saved value
 * @param {string} key - key to store value
 * @example I save 'value' to memory as 'key'
 * @example I save '$getRandomUser()' to memory as 'user'
 */
When(
   'I save {value} to memory as {value}',
    async function (value: MemoryValue, key: MemoryValue) {
      key.set(await value.value());
    }
);

When(
    'I save multiline string to memory as {value}:',
    async function (key: MemoryValue, multilineString: string) {
        const value: string = await this.getValue(multilineString);
        key.set(value);
    }
);

/**
 * Save value to memory
 * @param {string} key - key to store value
 * @param {string} value - value to save or alias for previously saved value
 * @example I set 'key' = 'value'
 */
When(
    'I set {value} = {value}',
    async function (key: MemoryValue, value: MemoryValue) {
        key.set(await value.value());
    }
);

/**
 * Save json value to memory
 * @param {string} key - key to store value
 * @param {string} json - multiline string
 * @example I save json to memory as 'key':
 * """
 * {
 *     "someKey": "someValue"
 * }
 * """
 */
When(
    'I save json to memory as {value}:',
    async function (key: MemoryValue, json: string) {
        const value: string = await this.getValue(json);
        key.set(JSON.parse(value));
    }
);

/**
 * Save key-value pairs to memory
 * @param {string} key - key to store value
 * @param {string} kv - key-value
 * @example I save key-value pairs to memory as 'key':
 * | someKey      | 42               |
 * | someOtherKey | $valueFromMemory |
 */
When(
    'I save key-value pairs to memory as {value}:',
    async function (key: MemoryValue, kv: DataTable) {
        const value = await dataTable2Object(this, kv);
        key.set(value);
    }
);
