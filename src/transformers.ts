import memory from '@qavajs/memory';

export function getValue(alias: string): any {
    return memory.getValue(alias)
}
