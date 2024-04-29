import { Camera, CameraResultType } from "@capacitor/camera";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useState } from "react";

const Settings: React.FC = () => {
  const [image, setImage] = useState<any>(null);

  const takePicture = async () => {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    });

    const img = `data:image/jpeg;base64,${photo.base64String}`;
    setImage(img);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding ion-content">
        <IonButton expand="full" onClick={takePicture}>
          Take picture
        </IonButton>
        <img src={image} alt="" />
      </IonContent>
    </IonPage>
  );
};

export default Settings;
