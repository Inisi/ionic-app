import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import { Capacitor } from "@capacitor/core";
import { JeepSqlite } from "jeep-sqlite/dist/components/jeep-sqlite";
import { defineCustomElements as pwaElements } from "@ionic/pwa-elements/loader";
import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";

pwaElements(window);
const platform = Capacitor.getPlatform();

const rootRender = () => {
  const container = document.getElementById("root");
  const root = createRoot(container!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

if (platform !== "web") {
  rootRender();
} else {
   try{
    window.addEventListener("DOMContentLoaded", async () => {
    const sqlite = new SQLiteConnection(CapacitorSQLite)
    customElements.define("jeep-sqlite", JeepSqlite);
    const jeepSqliteEl = document.createElement("jeep-sqlite");
    document.body.appendChild(jeepSqliteEl);
    await customElements.whenDefined("jeep-sqlite");
    console.log(`after customElements.whenDefined`);
    
    // Initialize the Web store
    await sqlite.initWebStore();
    console.log(`after initWebStore`);
    rootRender()
  })  }
   catch(err){
    console.log(err)
  }
}
