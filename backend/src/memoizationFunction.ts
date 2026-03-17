import fs from "fs";

//# How to improve:
//- If cache overflow much remove all of the overflow
//- Optimize using order of mose recent stuff
//- Fix repeating in the clener

const memoize = (
  fn: Function,
  cacheStorageFolder: string,
  cacheLimit: number | "unlimited" = "unlimited",
  cacheEvictionPolicy: "LRU" | "LFU" | "TimeBased" | ((cache: string[]) => string) = "LRU",
) => {
  const cache = fs.readdirSync(cacheStorageFolder).map((file) => file.slice(0, -5));

  const writeFile = (path: string, objToWrite: any) => {
    const objToWriteStringified = JSON.stringify(objToWrite);
    fs.writeFileSync(path, objToWriteStringified);
  };

  const removeFromCache = (key: string) => {
    if (cache.includes(key)) {
      const keyToRemoveIndex = cache.indexOf(key);
      cache.splice(keyToRemoveIndex, 1);
      fs.rmSync(cacheStorageFolder + key + ".json");
      console.log(`Removing ${key}`);
    }
  };

  const readFile = (path: string) => {
    const cacheEntryStringified = fs.readFileSync(path, {
      encoding: "utf8",
    });
    return JSON.parse(cacheEntryStringified);
  };

  const updateCache = (key: string, cacheEntry: any) => {
    cacheEntry.lastAccessed = new Date().getTime();
    cacheEntry.timesUsed++;
    writeFile(cacheStorageFolder + key + ".json", cacheEntry);
  };

  let cleanerInterval: NodeJS.Timeout;

  let cleaner = () => {
    const needToClean = cache.length !== 0 && cacheLimit !== "unlimited" && cache.length >= cacheLimit;
    switch (cacheEvictionPolicy) {
      case "LRU":
        if (needToClean) {
          let minTime = new Date().getTime();
          let searchedKey = "";
          for (let id = 0; id <= cache.length - 1; id++) {
            const cacheEntry = readFile(cacheStorageFolder + cache[id] + ".json");
            if (cacheEntry.lastAccessed <= minTime) {
              minTime = cacheEntry.lastAccessed;
              searchedKey = cache[id]!;
            }
          }
          removeFromCache(searchedKey);
        }
        break;
      case "LFU":
        if (needToClean) {
          console.log("LFU");
          let minUses = readFile(cacheStorageFolder + cache[0] + ".json").timesUsed;
          let searchedKey = "";
          for (let id = 0; id <= cache.length - 1; id++) {
            const cacheEntry = readFile(cacheStorageFolder + cache[id] + ".json");
            if (cacheEntry.timesUsed <= minUses) {
              minUses = cacheEntry.timesUsed;
              searchedKey = cache[id]!;
            }
          }
          console.log(searchedKey);
          removeFromCache(searchedKey);
        }
        break;
      case "TimeBased":
        if (cleanerInterval && cache.length === 0) clearInterval(cleanerInterval);
        if (!cleanerInterval && cache.length !== 0 && cacheLimit !== "unlimited")
          cleanerInterval = setInterval(
            () => {
              const timeNow = new Date().getTime();
              const keysToRemove = [];
              for (let id = 0; id <= cache.length - 1; id++) {
                const cacheEntry = readFile(cacheStorageFolder + cache[id] + ".json");
                if (timeNow - cacheEntry.creationTime < cacheLimit) continue;
                keysToRemove.unshift(cache[id]!);
              }
              for (let key in keysToRemove) {
                removeFromCache(key);
                console.log(`Time for ${key} expired, it was removed`);
              }
            },
            10 * 60 * 1000,
          );
        break;
      default:
        if (typeof cacheEvictionPolicy === "function") {
          //I know that this is bad. But other options i considered even worse
          const cacheCopy = cache.slice();
          const keyToRemove = cacheEvictionPolicy(cacheCopy);
          removeFromCache(keyToRemove);
        }
    }
  };

  //Main function
  return async (...args: any[]) => {
    const key = args[1].body.slice(9, -34); //Cutting to only get sentance from body of a request
    //const key = args.join("|");
    if (cache.includes(key)) {
      const cacheEntry = readFile(cacheStorageFolder + key + ".json");
      updateCache(key, cacheEntry);
      console.log("Used cache");
      return cacheEntry.obj;
    } else {
      cleaner();
      const newEntry = {
        obj: await fn(...args),
        lastAccessed: new Date().getTime(),
        timesUsed: 1,
        creationTime: new Date().getTime(),
      };
      writeFile(cacheStorageFolder + key + ".json", newEntry);
      cache.unshift(key);
      console.log("Made new value");
      return newEntry.obj;
    }
  };
};

export default memoize;
