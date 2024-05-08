import { Camera, CameraResultType } from "@capacitor/camera";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import React, { useState } from "react";

const Settings: React.FC = () => {
  const [image, setImage] = useState<any>(null);

  const [showalert] = useIonAlert();

  const takePicture = async () => {
    await BarcodeScanner.checkPermission({ force: true });

    // make background of WebView transparent
    // note: if you are using ionic this might not be enough, check below
    BarcodeScanner.hideBackground();

    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

    // if the result has content
    if (result.hasContent) {
      showalert({
        header: "Confirm!",
        message: "Are you sure you want to leave the page?",
        buttons: [
          { text: "Cancel", role: "cancel" },
          {
            text: "Proceed",
            handler() {
              window.open(result.content, "blank");
            },
          },
        ],
      });
      console.log(result.content); // log the raw scanned content
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Barcode Scanner</IonTitle>
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
