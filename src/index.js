import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AppContextProvider } from "./contexts/appContexts";
import { UserContextProvider } from "./contexts/userContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from 'react-router-dom';

const client = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <QueryClientProvider client={client}>
        <Router>
          <AppContextProvider>
            <App />
          </AppContextProvider>
        </Router>
      </QueryClientProvider>
    </UserContextProvider>
  </React.StrictMode>
);
