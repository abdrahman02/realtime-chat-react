import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { ModalContextProvider } from "./context/ModalContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ModalContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </ModalContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
