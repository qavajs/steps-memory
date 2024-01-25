import { DataTable, When } from '@cucumber/cucumber';
import memory from '@qavajs/memory';
import { getValue } from './transformers';
import { dataTable2Object } from './utils';

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
        memory.setValue(key, exprFn());
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
   'I save {string} to memory as {string}',
    async function (alias: string, key: string) {
      const value: string = await memory.getValue(alias);
      memory.setValue(key, value);
    }
);

When(
    'I save multiline string to memory as {string}:',
    async function (key: string, multilineString: string) {
        const value: string = await memory.getValue(multilineString);
        memory.setValue(key, value);
    }
);

/**
 * Save value to memory
 * @param {string} key - key to store value
 * @param {string} value - value to save or alias for previously saved value
 * @example I set 'key' = 'value'
 */
When(
    'I set {string} = {string}',
    async function (key: string, value: string) {
        const resolvedValue: string = await memory.getValue(value);
        memory.setValue(key, resolvedValue);
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
    'I save json to memory as {string}:',
    async function (key: string, json: string) {
        const value: string = await memory.getValue(json);
        memory.setValue(key, JSON.parse(value));
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
    'I save key-value pairs to memory as {string}:',
    async function (key: string, kv: DataTable) {
        const value = await dataTable2Object(kv);
        memory.setValue(key, value);
    }
);
