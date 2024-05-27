import React, { useState } from "react";
import { IonButton, IonIcon, IonInput, IonItem, IonLabel } from "@ionic/react";
import { UserData } from "../servicesTest/databaseFunctions";
import { Storage } from "@ionic/storage";

const storage = new Storage();
interface CreateNewUserProps {
  setShowCard: any;
  addUser: any;
  setNewUser: any;
  newUser: any;
  setShowLoading: Function;
}

const CreateNewUser = (props: CreateNewUserProps) => {
  const { setShowCard, addUser, setNewUser, newUser, setShowLoading } = props;

  const handleInputChange = (e: any, key: keyof UserData) => {
    setNewUser({
      ...newUser,
      [key]: e.target.value,
    });
  };

  return (
    <>
      <IonItem>
        <IonLabel position="stacked">First Name</IonLabel>
        <IonInput
          value={newUser.first_name}
          onIonChange={(e) => handleInputChange(e, "first_name")}
        />
        <IonLabel position="stacked">Last Name</IonLabel>
        <IonInput
          value={newUser.last_name}
          onIonChange={(e) => handleInputChange(e, "last_name")}
        />
        <IonLabel position="stacked">Email</IonLabel>
        <IonInput
          value={newUser.email}
          onIonChange={(e) => handleInputChange(e, "email")}
        />
        <IonButton
          onClick={() => {
            addUser(newUser);
            setShowLoading(true);
          }}
        >
          Submit
        </IonButton>
        <IonButton onClick={() => setShowCard(false)}>Cancel</IonButton>
      </IonItem>
    </>
  );
};

export default CreateNewUser;
