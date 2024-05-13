// EditUser.tsx
import React from "react";
import { IonButton, IonInput, IonItem, IonLabel } from "@ionic/react";
import { UserData } from "../servicesTest/databaseFunctions";

interface EditUserProps {
  setShowEditCard: (value: boolean) => void;
  editUser: (user: UserData) => void;
  setNewUser: (user: UserData) => void;
  newUser: UserData;
  selectedUserId: number;
}

const EditUser: React.FC<EditUserProps> = ({
  setShowEditCard,
  editUser,
  setNewUser,
  newUser,
  selectedUserId,
}) => {
  const handleInputChange = (e: any, key: string) => {
    if (key === "first" || key === "last") {
      setNewUser({
        ...newUser,
        id: selectedUserId,
        name: {
          ...newUser.name,
          [key]: e.target.value,
        },
      });
    } else {
      setNewUser({ ...newUser, [key]: e.target.value });
    }
  };

  const handleSubmit = () => {
    editUser(newUser);
    setShowEditCard(false);
  };

  return (
    <>
      <IonItem>
        <IonLabel position="stacked">First Name</IonLabel>
        <IonInput
          value={newUser.name.first}
          onIonChange={(e) => handleInputChange(e, "first")}
        />
        <IonLabel position="stacked">Last Name</IonLabel>
        <IonInput
          value={newUser.name.last}
          onIonChange={(e) => handleInputChange(e, "last")}
        />
        <IonLabel position="stacked">Email</IonLabel>
        <IonInput
          value={newUser.email}
          onIonChange={(e) => handleInputChange(e, "email")}
        />
        <IonButton onClick={handleSubmit}>Submit</IonButton>
        <IonButton onClick={() => setShowEditCard(false)}>Cancel</IonButton>
      </IonItem>
    </>
  );
};

export default EditUser;
