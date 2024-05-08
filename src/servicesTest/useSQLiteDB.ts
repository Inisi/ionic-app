// useSQLiteDB.ts
import { useEffect, useRef, useState } from "react";
import {
  SQLiteDBConnection,
  SQLiteConnection,
  CapacitorSQLite,
} from "@capacitor-community/sqlite";

const useSQLiteDB = () => {
  const db = useRef<SQLiteDBConnection | null>();
  const sqlite = useRef<SQLiteConnection | null>();
  const [initialized, setInitialized] = useState<boolean>(false);

  console.log(db);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        if (sqlite.current) return;

        sqlite.current = new SQLiteConnection(CapacitorSQLite);
        const ret = await sqlite.current.checkConnectionsConsistency();
        const isConn = (await sqlite.current.isConnection("myDatabase", false))
          .result;

        if (ret.result && isConn) {
          db.current = await sqlite.current.retrieveConnection(
            "myDatabase",
            false
          );
        } else {
          db.current = await sqlite.current.createConnection(
            "myDatabase",
            false,
            "no-encryption",
            1,
            false
          );
        }
      } catch (error) {
        console.error("Error initializing SQLite database:", error);
      }
    };

    initializeDB().then(() => {
      initializeTables();
      setInitialized(true);
    });
  }, []);

  const performSQLAction = async <T>(
    action: (db: SQLiteDBConnection | undefined) => Promise<T>,
    cleanup?: () => Promise<void>
  ): Promise<T> => {
    try {
      await db.current?.open();
      const result = await action(db.current || undefined);
      return result;
    } catch (error) {
      console.error("Error performing SQL action:", error);
      return [] as unknown as T; // Return an empty array in case of an error
    } finally {
      try {
        (await db.current?.isDBOpen())?.result && (await db.current?.close());
        cleanup && (await cleanup());
      } catch {}
    }
  };

  const initializeTables = async () => {
    performSQLAction(async (db: SQLiteDBConnection | undefined) => {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY,
          firstName TEXT,
          lastName TEXT,
          thumbnail TEXT,
          email TEXT
        )
      `;
      const respCT = await db?.execute(createTableQuery);

      console.log(`res: ${JSON.stringify(respCT)}`);
    });
  };

  return { performSQLAction, initialized, sqlite };
};

export default useSQLiteDB;
