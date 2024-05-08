export const UserUpgradeStatements = [
  {
    toVersion: 1,
    statements: [
      ` CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            firstName TEXT,
            lastName TEXT,
            thumbnail TEXT,
            email TEXT
          );`,
    ],
  },
  /* add new statements below for next database version when required*/
  /*
    {
    toVersion: 2,
    statements: [
        `ALTER TABLE users ADD COLUMN email TEXT;`,
    ]
    },
    */
];
