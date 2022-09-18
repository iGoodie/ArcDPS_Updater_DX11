import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";
import "@/utils/appdata.util.ts";

const rootElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
