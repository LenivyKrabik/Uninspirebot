declare global {
  interface Array<T> {
    mapAsync(applyFn: (element?: T, index?: number, array?: T[]) => any, thisArg?: any, signal?: AbortSignal): Promise<any[]>;
  }
}

declare global {
  interface Array<T> {
    mapAsyncCallback(
      applyFn: (element?: T, index?: number, array?: T[]) => any,
      callbackFn: (result: any[]) => void,
      thisArg?: any,
      signal?: AbortSignal,
    ): Promise<void>;
  }
}

Object.defineProperty(Array.prototype, "mapAsync", {
  value: async function <T>(applyFn: (element?: T, index?: number, array?: T[]) => any, thisArg: any = undefined, signal?: AbortSignal) {
    const newArray: any[] = [];
    for (let i = 0; i < this.length; i++) {
      if (signal?.aborted) throw new Error("AbortError");
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
    thisArg: any = undefined,
    signal?: AbortSignal,
  ) {
    const newArray: any[] = [];
    for (let i = 0; i < this.length; i++) {
      if (signal?.aborted) throw new Error("AbortError");
      newArray.push(await applyFn.call(thisArg, this[i], i, this));
    }
    callbackFn(newArray);
  },
  writable: true,
  configurable: true,
});

// Usage
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

// Abort functionality usage
const controller = new AbortController();
const signal = controller.signal;

a.mapAsync(
  (element, id, array) => {
    return [element, id, array];
  },
  undefined,
  signal,
)
  .then((value) => {
    console.table(value);
  })
  .catch((error) => {
    console.log(error);
  });
controller.abort();
