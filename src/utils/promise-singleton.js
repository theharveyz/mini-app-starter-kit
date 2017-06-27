import Promise from '../../node_modules/es6-promise/dist/es6-promise.min';

// promise 单例：避免频繁new promise导致的内存泄漏问题
export default class PromiseSigleton {
  static getInstance() {
    if (PromiseSigleton.promise) {
      return PromiseSigleton.promise;
    }
    // 注意：TypeError: You must pass a resolver function as the first argument to the promise constructor
    PromiseSigleton.promise = new Promise(() => {});
    return PromiseSigleton.promise;
  }
}
