export interface ControlReversalPromiseBase<T> {
  id: string;
  /**
   * Creates a new resolved promise for the provided value.
   * @param value A promise.
   * @returns A promise whose internal state matches the provided promise.
   */
  resolve?(value: T | PromiseLike<T>): void;

  /**
   * Creates a new rejected promise for the provided reason.
   * @param reason The reason the promise was rejected.
   * @returns A new rejected Promise.
   */
  reject?(reason?: any): void;

  /** 懒执行的 `promise.then`, 在 `fullfilled` 之前调用的 then 方法只有最后一次才会生效  */
  lazyThen?: Promise<T>['then'];

  /** 当前 Promise 是否已经 fullfilled */
  isFullfilled: boolean;
}

export interface ControlReversalPromise<T> extends ControlReversalPromiseBase<T>, Promise<T> {}

/**
 * 创建具备控制反转能力的 Promise 对象
 */
export function createControlReversalPromise<T = void>(): ControlReversalPromise<T> {
  const controlReversalPromiseBase: ControlReversalPromiseBase<T> = { isFullfilled: false, id: `id-${Math.random()}` };
  let lazyThenParam: Parameters<Promise<T>['then']> = [];
  const promise = new Promise<T>((resolve, reject) => {
    controlReversalPromiseBase.reject = reject;
    controlReversalPromiseBase.resolve = (...args) => {
      controlReversalPromiseBase.isFullfilled = true;
      resolve(...args);
    };
  });

  const lazyThenReturn = promise.then<any, any>(
    val => lazyThenParam?.[0]?.(val),
    reason => {
      if (lazyThenParam?.[1]) {
        return lazyThenParam?.[1]?.(reason);
      }
      throw reason
    }
  )

  controlReversalPromiseBase.lazyThen = (...args) => {
    if (controlReversalPromiseBase.isFullfilled) return promise.then(...args);
    lazyThenParam = args;
    return lazyThenReturn;
  }

  return Object.assign(promise, controlReversalPromiseBase);
}

export default createControlReversalPromise;
