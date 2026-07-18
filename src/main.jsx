import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/theme.css";
const savedLanguage = localStorage.getItem("language");
if (savedLanguage === "ku") {
  document.documentElement.dir = "rtl";
} else {
  document.documentElement.dir = "ltr";
}
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
     <App />
    </ThemeProvider>
  </BrowserRouter>
);