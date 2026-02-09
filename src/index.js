import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
//import MainContextProvider from "./Context/AdminContextProvider";
import ErrorBoundary from "./ErrorBoundary";
import AppRoutes from "./Routes/AppRoutes";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
