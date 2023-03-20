export default class Memory {

    arr = [1, 2, 3, 4, 5];
    getString = function (): string {
        return 'I was computed';
    };

    getStringAsync = function (): Promise<string> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('I was computed async');
            }, 50);
        });
    }
}
