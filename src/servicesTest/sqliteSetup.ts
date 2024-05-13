// sqliteSetup.ts

import { CapacitorSQLite, capSQLiteOptions } from "@capacitor-community/sqlite";
import { Capacitor } from "@capacitor/core";

const DATABASE_NAME = "myDatabase";
const DATABASE_VERSION = "1";
const TABLE_NAME = "users";

const initSQLite = async () => {
  if (Capacitor.isNative) {
    const options: capSQLiteOptions = {
      database: DATABASE_NAME,
      readonly: false,
    };

    // Open or create the database
    const db = await CapacitorSQLite.open(options);
    console.log("SQLite database opened:", db);

    return db;
  } else {
    console.warn("SQLite is not supported on the web platform.");
    return null;
  }
};
const createTable = async () => {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
          id INTEGER PRIMARY KEY,
          firstName TEXT,
          lastName TEXT,
          thumbnail TEXT,
          email TEXT
        )
      `;
  try {
    await CapacitorSQLite.execute({
      statements: createTableQuery,
      database: DATABASE_NAME,
    });
    console.log("Table created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
    throw error;
  }
};

const insertMockData = async () => {
  const mockData = [
    {
      id: 11,
      name: { first: "Inis", last: "Kryeziu" },
      picture: {
        thumbnail: "https://randomuser.me/api/portraits/thumb/men/14.jpg",
      },
      email: "inis.kryeziu@gmail.com",
    },
    {
      id: 1,
      name: { first: "John", last: "Doe" },
      picture: {
        thumbnail: "https://randomuser.me/api/portraits/thumb/men/1.jpg",
      },
      email: "john.doe@example.com",
    },
    {
      id: 2,
      name: { first: "Jane", last: "Doe" },
      picture: {
        thumbnail: "https://randomuser.me/api/portraits/thumb/women/2.jpg",
      },
      email: "jane.doe@example.com",
    },
    {
      id: 3,
      name: { first: "Alice", last: "Smith" },
      picture: {
        thumbnail: "https://randomuser.me/api/portraits/thumb/women/3.jpg",
      },
      email: "alice.smith@example.com",
    },
    {
      id: 4,
      name: { first: "Bob", last: "Johnson" },
      picture: {
        thumbnail: "https://randomuser.me/api/portraits/thumb/men/4.jpg",
      },
      email: "bob.johnson@example.com",
    },
    {
      id: 5,
      name: { first: "Emily", last: "Williams" },
      picture: {
        thumbnail: "https://randomuser.me/api/portraits/thumb/women/5.jpg",
      },
      email: "emily.williams@example.com",
    },
    {
      id: 6,
      name: { first: "Michael", last: "Brown" },
      picture: {
        thumbnail: "https://randomuser.me/api/portraits/thumb/men/6.jpg",
      },
      email: "michael.brown@example.com",
    },
    {
      id: 7,
      name: { first: "Olivia", last: "Jones" },
      picture: {
        thumbnail: "https://randomuser.me/api/portraits/thumb/women/7.jpg",
      },
      email: "olivia.jones@example.com",
    },
    {
      id: 8,
      name: { first: "William", last: "Garcia" },
      picture: {
        thumbnail: "https://randomuser.me/api/portraits/thumb/men/8.jpg",
      },
      email: "william.garcia@example.com",
    },
    {
      id: 9,
      name: { first: "Sophia", last: "Martinez" },
      picture: {
        thumbnail: "https://randomuser.me/api/portraits/thumb/women/9.jpg",
      },
      email: "sophia.martinez@example.com",
    },
    {
      id: 10,
      name: { first: "Liam", last: "Hernandez" },
      picture: {
        thumbnail: "https://randomuser.me/api/portraits/thumb/men/10.jpg",
      },
      email: "liam.hernandez@example.com",
    },
  ];

  try {
    for (const userData of mockData) {
      const { id, name, picture, email } = userData;
      const { first, last } = name;
      const { thumbnail } = picture;

      const insertQuery = `
            INSERT INTO ${TABLE_NAME} (id, firstName, lastName, thumbnail, email)
            VALUES (?, ?, ?, ?, ?)
          `;

      const values = [id, first, last, thumbnail, email];

      await CapacitorSQLite.execute({
        statements: insertQuery,
        values,
        database: DATABASE_NAME,
      } as any);
    }

    console.log("Mock data inserted successfully.");
  } catch (error) {
    console.error("Error inserting mock data:", error);
    throw error;
  }
};

const setupSQLiteDatabase = async () => {
  try {
    const db = await initSQLite();
    if (db != null) {
      await createTable(); // Pass the database connection to the createTable function
      await insertMockData(); // Pass the database connection to the insertMockData function
      console.log("SQLite database setup complete.");
    } else {
      console.error(
        "Error setting up SQLite database: No database connection."
      );
    }
  } catch (error) {
    console.error("Error setting up SQLite database:", error);
  }
};

export default setupSQLiteDatabase;
