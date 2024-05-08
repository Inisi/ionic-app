import React, { useState } from "react";
import { IonButton, IonIcon, IonInput, IonItem, IonLabel } from "@ionic/react";
import { UserData } from "../servicesTest/databaseFunctions";
import { Storage } from "@ionic/storage";

const storage = new Storage();
interface createNewUserProps {
  setShowCard: any;
}

const CreateNewUser = (props: createNewUserProps) => {
  const { setShowCard } = props;
  const [newUser, setNewUser] = useState<UserData>({
    id: 0,
    name: { first: "", last: "" },
    picture: { thumbnail: "" },
    email: "",
  });

  const handleInputChange = (e: any, key: any) => {
    setNewUser({ ...newUser, [key]: e.target.value });
  };

  const addUserToStorage = async (user: UserData) => {
    try {
      const storedUsers = await storage.get("users");
      if (storedUsers) {
        const updatedUsers = [...storedUsers, user];
        await storage.set("users", updatedUsers);
      } else {
        await storage.set("users", [user]);

        // Clear input fields after submission if needed
        setNewUser({
          id: 0,
          name: { first: "", last: "" },
          picture: { thumbnail: "" },
          email: "",
        });
        setShowCard(false);
      }
    } catch (error) {
      console.error("Error adding user to storage:", error);
    }
  };

  return (
    <>
      <IonItem>
        <IonLabel position="stacked">First Name</IonLabel>
        <IonInput
          onIonChange={(e) => handleInputChange(e.target.value, "first")}
        />
        <IonLabel position="stacked">Last Name</IonLabel>
        <IonInput
          onIonChange={(e) => handleInputChange(e.target.value, "last")}
        />
        <IonLabel position="stacked">Email</IonLabel>
        <IonInput
          onIonChange={(e) => handleInputChange(e.target.value, "email")}
        />
        {/* Add more input fields as needed */}
        <IonButton onClick={() => addUserToStorage(newUser)}>Submit</IonButton>
        <IonButton onClick={setShowCard(false)}>Submit</IonButton>
      </IonItem>
    </>
  );
};

export default CreateNewUser;
