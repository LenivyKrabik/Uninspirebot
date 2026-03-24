declare global {
  interface Array<T> {
    mapAsync(applyFn: (element: T, index: number, array: T[]) => any, thisArg?: any): any[];
  }
}

declare global {
  interface Array<T> {
    mapAsyncCallback(applyFn: (element: T, index: number, array: T[]) => any, callbackFn: (result: any[]) => void, thisArg?: any): void;
  }
}

Object.defineProperty(Array.prototype, "mapAsync", {
  value: async function <T>(applyFn: (element?: T, index?: number, array?: T[]) => any, thisArg = undefined) {
    const newArray: any[] = [];
    for (let i = 0; i < this.length; i++) {
      newArray.push(await applyFn.call(thisArg, this[i], i, this));
    }
    return newArray;
  },
  writable: true,
  configurable: true,
});
Object.defineProperty(Array.prototype, "mapAsyncCallback", {
  value: async function <T>(
    applyFn: (element?: T, index?: number, array?: T[]) => any,
    callbackFn: (result: any[]) => void,
    thisArg = undefined,
  ) {
    const newArray: any[] = [];
    for (let i = 0; i < this.length; i++) {
      newArray.push(await applyFn.call(thisArg, this[i], i, this));
    }
    callbackFn(newArray);
  },
  writable: true,
  configurable: true,
});

const a = ["Hello", "everybody", "my", "name", "is", "Markiplyer"];
console.table(
  await a.mapAsync((element, id, array) => {
    return [element, id, array];
  }),
);

let callbackResult;
(await a.mapAsyncCallback(
  (element, id, array) => {
    return [element, id, array];
  },
  (result) => {
    callbackResult = [...result, ["and", 69, "There is nothing to see here"]];
  },
),
  console.table(callbackResult));
