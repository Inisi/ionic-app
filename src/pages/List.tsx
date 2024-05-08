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
import { addCircle, trashBinOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { Storage } from "@ionic/storage";
import { UserData } from "../servicesTest/databaseFunctions";
import CreateNewUser from "./CreateNewUser";

const storage = new Storage();

const List: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);

  const [showCard, setShowCard] = useState(false);
  const [showAlert] = useIonAlert();
  const [showToast] = useIonToast();

  useEffect(() => {
    fetchUsersFromStorage();
  }, []);

  const fetchUsersFromStorage = async () => {
    try {
      const storedUsers = await storage.get("users");
      if (storedUsers) {
        setUsers(storedUsers);
      } else {
        // Create the storage key if it doesn't exist
        await storage.set("users", []);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users from storage:", error);
    }
  };

  const editUserInStorage = async (updatedUser: UserData) => {
    try {
      const storedUsers = await storage.get("users");
      if (storedUsers) {
        const updatedUsers = storedUsers.map((user: UserData) =>
          user.id === updatedUser.id ? updatedUser : user
        );
        await storage.set("users", updatedUsers);
        setUsers(updatedUsers);
      } else {
        console.error("No users found in storage.");
      }
    } catch (error) {
      console.error("Error editing user in storage:", error);
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
          handler: () => {
            storage.remove("users").then(() => {
              setUsers([]);
              showToast({
                message: "All users deleted",
                duration: 2000,
                color: "danger",
              });
            });
          },
        },
      ],
    });
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
              <IonCardContent className="ion-no-padding">
                <IonItem lines="none">
                  <IonAvatar slot="start">
                    <IonImg src={user.picture.thumbnail} />
                  </IonAvatar>
                  <IonLabel>
                    {user.name.first} {user.name.last}
                    <p>{user.email}</p>
                  </IonLabel>
                </IonItem>
              </IonCardContent>
            </IonCard>
          ))}

          <IonButton onClick={() => setShowCard(true)}>
            <IonIcon slot="icon-only" icon={addCircle} color="light"></IonIcon>
          </IonButton>
          {showCard && <CreateNewUser setShowCard={setShowCard} />}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default List;
