import sqlite3 from "sqlite3";

const errorHandler = (error: Error | null) => {
  if (error) console.error(error);
};
const entryParamsParser = (params: string) => {
  const result = [];
  const entries = params.split(",");
  for (const entry of entries) {
    result.push(entry.split(" ")[0]!);
  }
  return result;
};

class SQLiteDB {
  handler: (err: Error | null) => void;
  ifSuccess: (callback?: (value?: any[]) => void, reject?: (reason?: any) => void) => (error: Error | null, value?: any[]) => void;
  #db: sqlite3.Database;
  tableColumns: Map<string, string[]> = new Map();

  constructor(handler: (err: Error | null) => void = errorHandler) {
    this.handler = handler;
    this.ifSuccess = (callback = () => {}, reject?) => {
      return (error, value) => {
        if (error) {
          handler(error);
          if (reject) reject(error);
        } else callback.apply(this, [value]);
      };
    };
  }

  connect(path: string) {
    return new Promise((resolve, reject) => {
      //Connect to db
      let tablesLoaded = 0;
      this.#db = new sqlite3.Database(
        path,
        sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
        this.ifSuccess(
          () =>
            this.#db.serialize(() => {
              //Initialize memmory
              this.#db.all(
                `SELECT * FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%'`,
                [],
                this.ifSuccess((rows) => {
                  if (!rows) {
                    reject();
                    return;
                  }
                  const tablesAmount = rows.length;
                  if (tablesAmount == 0) resolve(undefined);

                  rows.forEach((row: any) => {
                    this.#db.all(
                      `PRAGMA table_info(${row.name})`,
                      this.ifSuccess((columns) => {
                        if (columns) {
                          this.tableColumns.set(
                            row.name,
                            columns.map((c) => c.name),
                          );
                          if (++tablesLoaded === tablesAmount) resolve(undefined);
                        }
                      }, reject),
                    );
                  });
                }, reject),
              );
            }),
          reject,
        ),
      );
    });
  }

  createTable = (name: string, params: string) => {
    return new Promise((resolve, reject) => {
      this.#db.run(
        `CREATE TABLE ${name}(${params})`,
        this.ifSuccess(() => {
          this.tableColumns.set(name, entryParamsParser(params));
          resolve(undefined);
        }, reject),
      );
    });
  };

  dropTable = (name: string) => {
    new Promise((resolve, reject) => {
      this.#db.run(
        `DROP TABLE ${name}`,
        this.ifSuccess(() => {
          this.tableColumns.delete(name);
          resolve(undefined);
        }, reject),
      );
    });
  };

  insert = (table: string, args: any[] = []) => {
    const params = this.tableColumns.get(table);
    if (params === undefined) {
      this.handler(new Error(`Table ${table} doesn't exist`));
      return;
    }
    const placeholders = "?,".repeat(params.length).slice(0, -1);
    const querry = `INSERT INTO ${table}(${params.join(",")}) VALUES (${placeholders})`;
    return new Promise((resolve, reject) => {
      this.#db.run(
        querry,
        args,
        this.ifSuccess(() => {
          resolve(undefined);
        }, reject),
      );
    });
  };

  custom = (querry: string, values: any[] = []) => {
    return new Promise((resolve, reject) => {
      this.#db.all(
        querry,
        values,
        this.ifSuccess((answer) => {
          resolve(answer);
        }, reject),
      );
    });
  };
  //Remove row
  //Change value in row
}

export default SQLiteDB;
