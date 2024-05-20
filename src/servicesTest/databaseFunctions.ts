// databaseFunctions.ts
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "./useSQLiteDB"; // Import the hook

const TABLE_NAME = "users";

export interface UserData {
  id: number;
  first_name:  string,
  last_name: string,
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
    first_name: row.first_name, 
    last_name: row.last_name ,
    picture: { thumbnail: row.thumbnail },
    email: row.email,
  }));
};

export const insertUserData = async (userData: UserData): Promise<void> => {
  const { first_name, last_name, picture, email } = userData;
  const { thumbnail } = picture;

  const { performSQLAction } = useSQLiteDB();
  await performSQLAction(async (db) => {
    const values = [ thumbnail, email];
    const insertQuery = `
      INSERT INTO ${TABLE_NAME} (first_name, last_Name, thumbnail, email)
      VALUES (${first_name}, ${last_name}, ${thumbnail}, ${email})
    `;

    await db?.execute(insertQuery);
  });
};

export const updateUserData = async (
  userId: number,
  updatedUserData: UserData
): Promise<void> => {
  const { first_name, last_name, picture, email } = updatedUserData;
  const { thumbnail } = picture;

  const { performSQLAction } = useSQLiteDB();
  await performSQLAction(async (db) => {
    const values = [first_name, last_name, thumbnail, email, userId];
    const updateQuery = `
      UPDATE ${TABLE_NAME}
      SET first_name=${first_name}, last_name=${last_name}, ${thumbnail}, email=${email}
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
