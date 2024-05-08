import { platform } from "../App";
import { BehaviorSubject } from "rxjs";
import { ISQLiteService } from "../services/sqliteService";
import { IDbVersionService } from "../services/dbVersionService";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { UserUpgradeStatements } from "../upgrades/user.upgrade.statements";
import { UserData } from "../servicesTest/databaseFunctions";

export interface IStorageService {
  initializeDatabase(): Promise<void>;
  getUsers(): Promise<UserData[]>;
  addUser(user: UserData): Promise<number>;
  updateUserById(id: string, active: number): Promise<void>;
  deleteUserById(id: string): Promise<void>;
  getDatabaseName(): string;
  getDatabaseVersion(): number;
}
class StorageService implements IStorageService {
  versionUpgrades = UserUpgradeStatements;
  loadToVersion =
    UserUpgradeStatements[UserUpgradeStatements.length - 1].toVersion;
  db!: SQLiteDBConnection;
  database: string = "myDatabase";
  sqliteServ!: ISQLiteService;
  dbVerServ!: IDbVersionService;
  isInitCompleted = new BehaviorSubject(false);

  constructor(
    sqliteService: ISQLiteService,
    dbVersionService: IDbVersionService
  ) {
    this.sqliteServ = sqliteService;
    this.dbVerServ = dbVersionService;
  }

  getDatabaseName(): string {
    return this.database;
  }
  getDatabaseVersion(): number {
    return this.loadToVersion;
  }
  async initializeDatabase(): Promise<void> {
    // create upgrade statements
    try {
      await this.sqliteServ.addUpgradeStatement({
        database: this.database,
        upgrade: this.versionUpgrades,
      });
      this.db = await this.sqliteServ.openDatabase(
        this.database,
        this.loadToVersion,
        false
      );
      const isData = await this.db.query("select * from sqlite_sequence");
      if (isData.values!.length === 0) {
        // create database initial users if any
      }

      this.dbVerServ.setDbVersion(this.database, this.loadToVersion);
      if (platform === "web") {
        await this.sqliteServ.saveToStore(this.database);
      }
      this.isInitCompleted.next(true);
    } catch (error: any) {
      const msg = error.message ? error.message : error;
      throw new Error(`storageService.initializeDatabase: ${msg}`);
    }
  }
  async getUsers(): Promise<UserData[]> {
    return (await this.db.query("SELECT * FROM users;")).values as UserData[];
  }
  async addUser(user: UserData): Promise<number> {
    const sql = `INSERT INTO users (name) VALUES (?);`;
    const res = await this.db.run(sql, [user.name]);
    if (
      res.changes !== undefined &&
      res.changes.lastId !== undefined &&
      res.changes.lastId > 0
    ) {
      return res.changes.lastId;
    } else {
      throw new Error(`storageService.addUser: lastId not returned`);
    }
  }
  async updateUserById(id: string, active: number): Promise<void> {
    const sql = `UPDATE users SET active=${active} WHERE id=${id}`;
    await this.db.run(sql);
  }
  async deleteUserById(id: string): Promise<void> {
    const sql = `DELETE FROM users WHERE id=${id}`;
    await this.db.run(sql);
  }
}
export default StorageService;
