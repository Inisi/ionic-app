import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import _, { result } from "lodash";
import {
  addCircle,
  compassSharp,
  pencil,
  trashBinOutline,
  trashSharp,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { Storage } from "@ionic/storage";
import { UserData } from "../servicesTest/databaseFunctions";
import CreateNewUser from "./CreateNewUser";
import useSQLiteDB from "../servicesTest/useSQLiteDB";
import EditUser from "./editUser";
import axios from "axios";

const storage = new Storage();

const List: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData>({
    id: 0, // Initialize id with 0
    first_name: "",
    last_name: "",
    picture: { thumbnail: "" },
    email: "",
  });
  const [newUser, setNewUser] = useState<UserData>({
    id: 0, // Initialize id with 0
    first_name: "",
    last_name: "",
    picture: { thumbnail: "" },
    email: "",
  });
  const { performSQLAction, initialized, db, openDatabase } = useSQLiteDB();

  const [showCard, setShowCard] = useState(false);
  const [showEditCard, setShowEditCard] = useState(false);
  const [showAlert] = useIonAlert();
  const [showToast] = useIonToast();

  useEffect(() => {
    initializeStorage();
  }, []);

  const initializeStorage = async () => {
    try {
      await storage.create();
    } catch (error) {
      console.error("Error initializing storage:", error);
    }
  };

  useEffect(() => {
    // openDatabase().catch((error) => {
    //   console.error("Error opening database:", error);
    // });
    fetchUsers();
  }, [initialized]);

  // Inside List component
  const fetchUsers = async () => {
    try {
      // Check if database connection is established
      if (initialized && db.current) {
        // Synchronize data with database
        //await syncDataWithDatabase();
      }
      await fetchUsersFromApi();
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const syncDataWithDatabase = async (result: UserData[]) => {
    try {
      alert(1);
      let operations: any | undefined = [];
      if (initialized && db.current !== null) {
        console.log("initialized", initialized, db.current);
        await performSQLAction(async (db) => {
          let respSelect = await db?.query(`SELECT * FROM operations`);
          operations = respSelect?.values;
        });
        console.log(operations);
        if (operations?.length > 0) {
          operations.map(async (operation: any) => {
            console.log(operation);
            switch (operation.type) {
              case "post":
                await fetch("http://10.138.88.77:3000/users", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: operation.data,
                });
                break;
              case "update":
                await axios.put(`/api/users/`);
                break;
              case "delete":
                await axios.delete(`/api/users/${operation.email}`);
                break;
              default:
                throw new Error(`Unknown operation type: ${operation.type}`);
            }
          });
          await performSQLAction(async (db) => {
            let respSelect = await db?.query(`DELETE FROM operations`);
            console.log(respSelect, "operations after deleted");
          });
        }
      }
    } catch (error) {
      console.error("Error syncing data with database:", error);
    }
  };

  const fetchUsersFromApi = async () => {
    try {
      const response = await fetch("http://10.138.88.77:3000/data", {
        method: "GET",
      });
      const result = await response.json();
      console.log("Response:", result);
      await syncDataWithDatabase(result);

      if (!result.length) {
        await performSQLAction(async (db) => {
          const respSelect = await db?.query(`SELECT FROM users`);
          setUsers(respSelect?.values || []);
        });
      } else {
        await performSQLAction(async (db) => {
          await db?.run(`DELETE  FROM users`);
        });
        result.map(async (res: UserData) => {
          await performSQLAction(async (db) => {
            const respSelect = await db?.query(
              `INSERT INTO users (first_name, last_name, email) VALUES (?, ?, ?)`,
              [res.first_name, res.last_name, res.email]
            );
          });

          setUsers(result || []);

          console.log("Database connection successful, fetched from API");
        });
      }
    } catch (error) {
      console.error("Error fetching users from database:", error);
      await performSQLAction(async (db) => {
        const respSelect = await db?.query(`SELECT * FROM users`);
        console.log(respSelect);
        setUsers(respSelect?.values || []);
      });
      //await fetchUsersFromStorage();
      throw error;
    }
  };

  const addUser = async (user: UserData) => {
    try {
      const response = await fetch("http://10.138.88.77:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const result = await response.json();
      console.log("Response:", result);
      setNewUser({
        id: getLastId([...users, user]) + 1,
        first_name: "",
        last_name: "",
        picture: { thumbnail: "" },
        email: "",
      });
      setShowCard(false);
    } catch (error) {
      console.error("Error adding user to database:", error);
      await performSQLAction(async (db) => {
        await db?.run(
          `INSERT INTO users (first_name, last_name, email) VALUES (?, ?, ?)`,
          [user.first_name, user.last_name, user.email]
        );
      });
      await performSQLAction(async (db) => {
        await db?.run(`INSERT INTO operations (type, data) VALUES (?, ?)`, [
          "post",
          JSON.stringify(user),
        ]);
      });
    }
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  const editUser = async (updatedUser: UserData) => {
    try {
      await performSQLAction(async (db) => {
        await db?.run(
          `UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?`,
          [
            updatedUser.first_name,
            updatedUser.last_name,
            updatedUser.email,
            updatedUser.id,
          ]
        );
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      setShowEditCard(false);
    } catch (error) {
      console.error("Error editing user in database:", error);
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      await performSQLAction(async (db) => {
        await db?.run(`DELETE FROM users WHERE id = ?`, [userId]);
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user from database:", error);
    }
  };

  const clearList = () => {
    showAlert({
      header: "Confirm!",
      message: "Are you sure you want to delete the users?",
      buttons: [
        { text: "Cancel", role: "cancel" },
        {
          text: "Delete",
          handler: async () => {
            try {
              await performSQLAction(async (db) => {
                await db?.run(`DELETE FROM users`);
              });
              setUsers([]);
              showToast({
                message: "All users deleted",
                duration: 2000,
                color: "danger",
              });
            } catch (error) {
              console.error("Error clearing users from database:", error);
            }
          },
        },
      ],
    });
  };

  const getLastId = (users: UserData[]): number => {
    if (users.length === 0) {
      return 0; // If the array is empty, return 0 as the last ID
    }
    return users.reduce(
      (maxId, user) => (user.id > maxId ? user.id : maxId),
      users[0].id
    );
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>List</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={clearList}>
              <IonIcon slot="icon-only" icon={trashBinOutline} color="light" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar color="primary">
          <IonSearchbar />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding ion-content">
        <IonList>
          {users.map((user: any, index: number) => (
            <IonCard key={index}>
              <IonItemSliding key={index}>
                <IonItemOptions side="start">
                  <IonButton color="danger" onClick={() => deleteUser(user.id)}>
                    Delete
                  </IonButton>
                </IonItemOptions>
                <IonItemOptions side="end">
                  <IonButton
                    color="medium"
                    onClick={() => {
                      setShowEditCard(!showEditCard);
                      setSelectedUser(user);
                    }}
                  >
                    Edit
                  </IonButton>
                </IonItemOptions>
                <IonCardContent className="ion-no-padding">
                  <IonItem lines="none">
                    <IonAvatar slot="start">
                      <IonImg src={user.picture?.thumbnail} />
                    </IonAvatar>
                    <IonLabel>
                      {user.first_name} {user.last_name}
                      <p>{user.email}</p>
                    </IonLabel>
                    <IonButton color="none" onClick={() => deleteUser(user.id)}>
                      <IonIcon
                        slot="icon-only"
                        icon={trashSharp}
                        color="danger"
                      ></IonIcon>
                    </IonButton>
                    <IonButton
                      color="none"
                      onClick={() => {
                        setShowEditCard(!showEditCard);
                        setSelectedUser(user);
                      }}
                    >
                      <IonIcon
                        slot="icon-only"
                        icon={pencil}
                        color="medium"
                      ></IonIcon>
                    </IonButton>
                  </IonItem>
                  {selectedUser?.id === user.id && showEditCard && (
                    <EditUser
                      setShowEditCard={setShowEditCard}
                      editUser={editUser}
                      selectedUser={selectedUser}
                      setSelectedUser={setSelectedUser}
                    />
                  )}
                </IonCardContent>
              </IonItemSliding>
            </IonCard>
          ))}

          <IonButton onClick={() => setShowCard(!showCard)}>
            <IonIcon slot="icon-only" icon={addCircle} color="light"></IonIcon>
          </IonButton>
        </IonList>
        {showCard && (
          <CreateNewUser
            setShowCard={setShowCard}
            newUser={newUser}
            setNewUser={setNewUser}
            addUser={addUser}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default List;
