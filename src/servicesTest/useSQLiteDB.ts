// useSQLiteDB.tsx

import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { useState } from "react";
import { Storage } from "@ionic/storage";

const useSQLiteDB = () => {
  const [dbOpened, setDbOpened] = useState(false);
  const [sqliteDB, setSqliteDB] = useState<SQLiteDBConnection | null>(null);
  const storage = new Storage();

  const openDatabase = async () => {
    try {
      const db = new SQLiteDBConnection("myDatabase", false, "no-encryption");
      await db.open();
      setSqliteDB(db);
      setDbOpened(true);
    } catch (error) {
      console.error("Error opening SQLite database:", error);
      setDbOpened(false);
      throw error;
    }
  };

  const performSQLAction = async (
    action: (db: SQLiteDBConnection) => Promise<void>
  ) => {
    if (dbOpened && sqliteDB) {
      try {
        await action(sqliteDB);
        console.log("SQLite database connected");
      } catch (error) {
        console.error("SQL Action error:", error);
      }
    } else {
      console.log(
        "SQLite database connection not established, falling back to Ionic Storage for CRUD operations"
      );
      throw new Error("SQLite database connection not established");
    }
  };

  return { performSQLAction, openDatabase, dbOpened, sqliteDB };
};

export default useSQLiteDB;
