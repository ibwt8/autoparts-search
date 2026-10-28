import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import "./app/styles.scss";

import App from "./app/App";
import { createAppStore } from "./app/store";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={createAppStore()}>
      <App />
    </Provider>
  </React.StrictMode>,
);
