// useSQLiteDB.tsx

import { SQLiteConnection, SQLiteDBConnection, CapacitorSQLite } from "@capacitor-community/sqlite";
import { useEffect, useRef, useState } from "react";
import { Storage } from "@ionic/storage";

const useSQLiteDB = () => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const sqlite = useRef<SQLiteConnection>()
  const db = useRef<SQLiteDBConnection>()

  const storage = new Storage();

  useEffect(()=>{
    const initializeDB = async () => {
      if (sqlite.current) return;

      sqlite.current = new SQLiteConnection(CapacitorSQLite);
      console.log(sqlite.current)
      const ret = await sqlite.current.checkConnectionsConsistency();
      console.log(ret)
      const isConn = (await sqlite.current.isConnection("mydatabase", false))
        .result;

      console.log('isConnected', isConn)
      if (ret.result && isConn) {
        db.current = await sqlite.current.retrieveConnection("mydatabase", false);
      } else {
        db.current = await sqlite.current.createConnection(
          "mydatabase",
          false,
          "no-encryption",
          1,
          false
        );
      }
      console.log(db)
    };

    initializeDB().then(() => {
      console.log('success')
      initializeTables();
      setInitialized(true);
    }).catch(err => {console.log('My error', err)})
  }, [])

  const initializeTables = async () => {
    const queryCreateTable = [
      ` CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        thumbnail TEXT,
        email TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS operations (
        id INTEGER PRIMARY KEY,
        type TEXT,
        data JSON
      );`
      ]
    await performSQLAction(async (db: SQLiteDBConnection | undefined) => {  
      if (!db) {
      console.error('Database connection is not initialized');
      return;
      }

      for (const query of queryCreateTable) {
        try {
          const response = await db.execute(query);
          console.log(`Table creation response: ${JSON.stringify(response)}`);
        } catch (error) {
          console.error(`Error executing query: ${query}`, error);
        }
      }
    
    });
  };

  const performSQLAction = async (
    action: (db: SQLiteDBConnection | undefined) => Promise<void>,
    cleanup?: () => Promise<void>
  ) => {
    try {
      await db.current?.open();
      await action(db.current);
    } catch (error) {
     console.log(error)
    } finally {
      try {
        (await db.current?.isDBOpen())?.result && (await db.current?.close());
        cleanup && (await cleanup());
      } catch {}
    }
  };

  const openDatabase = async () => {
    try {
      const newDbConnection = new SQLiteDBConnection("myDatabase", false, "no-encryption");
      await newDbConnection.open();
      console.log(newDbConnection)
      db.current = newDbConnection
      setInitialized(true);
    } catch (error) {
      console.error("Error opening SQLite database:", error);
      setInitialized(false);
      throw error;
    }
  };


  return { performSQLAction, initialized, db, openDatabase  };
};

export default useSQLiteDB;
