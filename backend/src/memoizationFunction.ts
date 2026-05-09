// import fs from "fs";
import logger from "./services/logger.ts";
import SQLiteDB from "./services/SQLiteDBManager.ts";

//# How to improve:
//- If cache overflow much remove all of the overflow
//- Optimize using order of mose recent stuff
//- Fix repeating in the clener

const memoize = async (
  fn: Function,
  cacheStorageFile: string,
  cacheLimit: number | "unlimited" = "unlimited",
  cacheEvictionPolicy: "LRU" | "LFU" | "TimeBased" | ((cache: string[]) => string) = "LRU",
) => {
  let cache: string[] = [];
  const db = new SQLiteDB();
  const log = logger("INFO", "CONSOLE");
  db.custom = log(db.custom);

  const cacheInit = async () => {
    await db.connect(cacheStorageFile);
    if (!db.tableColumns.has("audioWisdoms")) await db.createTable("audioWisdoms", "text STRING PRIMARY KEY, entry STRING");
    const allCached = (await db.custom(`SELECT text FROM audioWisdoms`)) as any;
    if (allCached !== undefined)
      for (const entry of allCached) {
        cache.push(entry.text);
      }
    // OLD STUFF
    // cache = fs.readdirSync(cacheStorageFolder).map((file) => file.slice(0, -5));
  };
  await cacheInit();

  const writeFile = (key: string, objToWrite: any) => {
    const objToWriteStringified = JSON.stringify(objToWrite);
    db.insert("audioWisdoms", [key, objToWriteStringified]);
    // fs.writeFileSync(cacheStorageFolder + key + ".json", objToWriteStringified);
  };

  const removeFromCache = (key: string) => {
    if (cache.includes(key)) {
      const keyToRemoveIndex = cache.indexOf(key);
      cache.splice(keyToRemoveIndex, 1);
      db.custom(`DELETE FROM audioWisdoms WHERE text = ?`, [key]);
      // OLD STUFF
      // fs.rmSync(cacheStorageFolder + key + ".json");
      console.log(`Removed ${key}`);
    }
  };

  const readFile = async (key: string | undefined) => {
    if (key === undefined) return undefined;
    const cacheEntryObj = (await db.custom(`SELECT entry FROM audioWisdoms WHERE text = ?`, [key])) as any;
    const cacheEntryStringified = cacheEntryObj[0].entry;
    // const cacheEntryStringified = fs.readFileSync(cacheStorageFolder + key + ".json", {
    //   encoding: "utf8",
    // });
    return JSON.parse(cacheEntryStringified);
  };

  const updateCache = (key: string, cacheEntry: any) => {
    cacheEntry.lastAccessed = new Date().getTime();
    cacheEntry.timesUsed++;
    db.custom(`UPDATE audioWisdoms SET entry = ? WHERE text = ?`, [JSON.stringify(cacheEntry), key]);
    // writeFile(key, cacheEntry);
  };

  let cleanerInterval: NodeJS.Timeout;

  let cleaner = async () => {
    const needToClean = cache.length !== 0 && cacheLimit !== "unlimited" && cache.length >= cacheLimit;
    switch (cacheEvictionPolicy) {
      case "LRU":
        if (needToClean) {
          let minTime = new Date().getTime();
          let searchedKey = "";
          for (let id = 0; id <= cache.length - 1; id++) {
            const cacheEntry = await readFile(cache[id]);
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
          let minUses = (await readFile(cache[0])).timesUsed;
          let searchedKey = "";
          for (let id = 0; id <= cache.length - 1; id++) {
            const cacheEntry = await readFile(cache[id]);
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
            async () => {
              const timeNow = new Date().getTime();
              const keysToRemove = [];
              for (let id = 0; id <= cache.length - 1; id++) {
                const cacheEntry = await readFile(cache[id]);
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
      const cacheEntry = await readFile(key);
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
