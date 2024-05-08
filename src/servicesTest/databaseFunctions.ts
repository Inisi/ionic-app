// databaseFunctions.ts
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "./useSQLiteDB"; // Import the hook

const TABLE_NAME = "users";

export interface UserData {
  id: number;
  name: {
    first: string;
    last: string;
  };
  picture: {
    thumbnail: string;
  };
  email: string;
}

export const fetchUserData = async (
  db: SQLiteDBConnection | undefined
): Promise<UserData[]> => {
  const query = `SELECT * FROM ${TABLE_NAME}`;
  const result = await db?.query(query);

  if (!result || !result.values) {
    return [];
  }

  return result.values.map((row: any) => ({
    id: row.id,
    name: { first: row.firstName, last: row.lastName },
    picture: { thumbnail: row.thumbnail },
    email: row.email,
  }));
};

export const insertUserData = async (userData: UserData): Promise<void> => {
  const { name, picture, email } = userData;
  const { first, last } = name;
  const { thumbnail } = picture;

  const { performSQLAction } = useSQLiteDB();
  await performSQLAction(async (db) => {
    const values = [first, last, thumbnail, email];
    const insertQuery = `
      INSERT INTO ${TABLE_NAME} (firstName, lastName, thumbnail, email)
      VALUES (${first}, ${last}, ${thumbnail}, ${email})
    `;

    await db?.execute(insertQuery);
  });
};

export const updateUserData = async (
  userId: number,
  updatedUserData: UserData
): Promise<void> => {
  const { name, picture, email } = updatedUserData;
  const { first, last } = name;
  const { thumbnail } = picture;

  const { performSQLAction } = useSQLiteDB();
  await performSQLAction(async (db) => {
    const values = [first, last, thumbnail, email, userId];
    const updateQuery = `
      UPDATE ${TABLE_NAME}
      SET firstName=${first}, lastName=${last}, ${thumbnail}, email=${email}
      WHERE id=${userId}
    `;

    await db?.execute(updateQuery);
  });
};

export const deleteUserData = async (userId: number): Promise<void> => {
  const { performSQLAction } = useSQLiteDB();
  await performSQLAction(async (db) => {
    const values = [userId];
    const deleteQuery = `DELETE FROM ${TABLE_NAME} WHERE id=${userId}`;

    await db?.execute(deleteQuery);
  });
};
