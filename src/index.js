import React from "react";
import "./styles/font.css";
import "./styles/color.css";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/index.css";
import "./styles/style-guide.css";
import "styles/tailwind.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "util/AuthContext";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
