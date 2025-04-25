import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { AppProvider } from "./context/AppContext";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <AppProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </AppProvider>
);
