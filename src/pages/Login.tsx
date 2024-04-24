import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonRouter,
} from "@ionic/react";
import { logInOutline, personCircleOutline } from "ionicons/icons";
import React from "react";
import tslogo from "../assets/tslogo.svg";

const Login: React.FC = () => {
  const router = useIonRouter();
  const [present, dismiss] = useIonLoading();

  const doLogin = async (event: any) => {
    event.preventDefault();
    await present("Logging in ...");
    setTimeout(async () => {
      dismiss();
      router.push("/app", "root");
    }, 2000);
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Smart Cantina</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-content ion-padding">
        <IonGrid fixed>
          <IonRow class="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <div className="ion-text-center ioin-padding">
                <img src={tslogo} alt="TS LOGO" width={"50%"}></img>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonRow class="ion-justify-content-center">
          <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
            <IonCard>
              <IonCardContent>
                <form onSubmit={doLogin}>
                  <IonInput
                    fill="outline"
                    labelPlacement="floating"
                    label="Email"
                    type="email"
                    placeholder="i.kryeziu@teamsystem.com"
                  ></IonInput>
                  <IonInput
                    className="ion-margin-top"
                    fill="outline"
                    labelPlacement="floating"
                    label="Password"
                    type="password"
                  ></IonInput>
                  <IonButton
                    type="submit"
                    expand="block"
                    className="ion-margin-top"
                  >
                    Login<IonIcon icon={logInOutline} slot="end"></IonIcon>
                  </IonButton>
                  <IonButton
                    routerLink="/register"
                    type="button"
                    expand="block"
                    className="ion-margin-top"
                    color="light"
                  >
                    Create Account
                    <IonIcon icon={personCircleOutline} slot="end"></IonIcon>
                  </IonButton>
                </form>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Login;
