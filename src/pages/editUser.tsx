// EditUser.tsx
import React from "react";
import { IonButton, IonInput, IonItem, IonLabel } from "@ionic/react";
import { UserData } from "../servicesTest/databaseFunctions";

interface EditUserProps {
  setShowEditCard: (value: boolean) => void;
  editUser: (user: UserData) => void;
  setSelectedUser: (user: UserData) => void;
  selectedUser: UserData;
}

const EditUser: React.FC<EditUserProps> = ({
  setShowEditCard,
  editUser,
  selectedUser,
  setSelectedUser
}) => {
  const handleInputChange = (e: any, key: keyof UserData) => {
    setSelectedUser((prevUser: UserData): UserData => {
      return {
          ...prevUser,
          [key]: e.target.value,
      };
  })
  };

  const handleSubmit = () => {
    editUser(selectedUser);
    setShowEditCard(false);
  };

  return (
    <>
      <IonItem>
        <IonLabel position="stacked">First Name</IonLabel>
        <IonInput
          value={selectedUser.first_name}
          onIonChange={(e) => handleInputChange(e, "first_name")}
        />
        <IonLabel position="stacked">Last Name</IonLabel>
        <IonInput
          value={selectedUser.last_name}
          onIonChange={(e) => handleInputChange(e, "last_name")}
        />
        <IonLabel position="stacked">Email</IonLabel>
        <IonInput
          value={selectedUser.email}
          onIonChange={(e) => handleInputChange(e, "email")}
        />
        <IonButton onClick={handleSubmit}>Submit</IonButton>
        <IonButton onClick={() => setShowEditCard(false)}>Cancel</IonButton>
      </IonItem>
    </>
  );
};

export default EditUser;
