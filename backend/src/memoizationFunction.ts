import fs from "fs";
import Stream from "stream";

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
  let cache: string[];
  const cacheInit = () => {
    cache = fs.readdirSync(cacheStorageFolder).map((file) => file.slice(0, -5));
  };
  cacheInit();

  const writeFile = (key: string, objToWrite: any) => {
    const objToWriteStringified = JSON.stringify(objToWrite);
    fs.writeFileSync(cacheStorageFolder + key + ".json", objToWriteStringified);
  };

  const removeFromCache = (key: string) => {
    if (cache.includes(key)) {
      const keyToRemoveIndex = cache.indexOf(key);
      cache.splice(keyToRemoveIndex, 1);
      fs.rmSync(cacheStorageFolder + key + ".json");
      console.log(`Removing ${key}`);
    }
  };

  const readFile = (key: string | undefined) => {
    if (key === undefined) return undefined;
    const cacheEntryStringified = fs.readFileSync(cacheStorageFolder + key + ".json", {
      encoding: "utf8",
    });
    return JSON.parse(cacheEntryStringified);
  };

  const updateCache = (key: string, cacheEntry: any) => {
    cacheEntry.lastAccessed = new Date().getTime();
    cacheEntry.timesUsed++;
    writeFile(key, cacheEntry);
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
            const cacheEntry = readFile(cache[id]);
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
          let minUses = readFile(cache[0]).timesUsed;
          let searchedKey = "";
          for (let id = 0; id <= cache.length - 1; id++) {
            const cacheEntry = readFile(cache[id]);
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
                const cacheEntry = readFile(cache[id]);
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
    const rep = await args[0].clone().json();
    if (Object.hasOwn(rep, "detail")) {
      const message = await rep.detail.stringify();
      throw new Error(`Elevenlabs bad massage: ${message}`);
    }
    const key = rep.alignment.characters.join(""); //Cutting to only get sentance from body of a request
    //const key = args.join("|");
    if (cache.includes(key)) {
      const cacheEntry = readFile(key);
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
      writeFile(key, newEntry);
      cache.unshift(key);
      console.log("Made new value");
      return newEntry.obj;
    }
  };
};

export default memoize;
