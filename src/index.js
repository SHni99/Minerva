import React from "react";
import "./styles/font.css";
import "./styles/color.css";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/index.css";
import "./styles/style-guide.css";
import "styles/tailwind.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-loading-skeleton/dist/skeleton.css";
import "rc-slider/assets/index.css";
import { AuthProvider } from "util/AuthContext";

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById("root")
);
