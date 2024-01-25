export default class Memory {

    emptyArray = [];
    arr = [1, 2, 3, 4, 5];
    reverseArr = [5, 4, 3, 2, 1];
    getComputedString = function (): string {
        return 'I was computed';
    };

    getStringAsync = function (): Promise<string> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('I was computed async');
            }, 50);
        });
    }

    ascending = (a: number, b: number) => a - b;
    descending = (a: number, b: number) => b - a;
    multilineMemoryValue = `Carriage\nreturn`;
}
