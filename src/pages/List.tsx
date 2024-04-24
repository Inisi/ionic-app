import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
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
  useIonViewWillEnter,
} from "@ionic/react";
import { trashBinOutline } from "ionicons/icons";
import React, { useState } from "react";

const List: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<
    {
      name: { first: string; last: string };
      picture: { thumbnail: string };
      email: string;
    }[]
  >([]);
  const [showalert] = useIonAlert();
  const [showToast] = useIonToast();

  useIonViewWillEnter(() => {
    getUsers();
    setLoading(false);
  });
  const getUsers = async () => {
    const data = await fetch("https://randomuser.me/api?results=10");
    const users = await data.json();
    setUsers(users.results);
  };

  const clearList = () => {
    showalert({
      header: "Confirm!",
      message: "Are you sure you want to delete the users?",
      buttons: [
        { text: "Cancel", role: "cancel" },
        {
          text: "Delete",
          handler() {
            setUsers([]);
            showToast({
              message: "All users deleted",
              duration: 2000,
              color: "danger",
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
            <IonMenuButton></IonMenuButton>
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
        {users &&
          users.map((user, index) => (
            <IonCard key={index}>
              <IonCardContent className="ion-no-padding">
                <IonItem lines="none">
                  <IonAvatar slot="start">
                    <IonImg src={user.picture.thumbnail}></IonImg>
                  </IonAvatar>
                  <IonLabel>
                    {user.name.first} {user.name.last}
                    <p>{user.email}</p>
                  </IonLabel>
                </IonItem>
              </IonCardContent>
            </IonCard>
          ))}
      </IonContent>
    </IonPage>
  );
};

export default List;
