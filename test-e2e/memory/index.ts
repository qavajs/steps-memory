export default class Memory {
  getString = function(): string {
    return 'I was computed';
  };

  getStringAsync = function(): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('I was computed async');
    }, 50);
  });
  }
}
