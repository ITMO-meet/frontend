import React from "react";
import ReactDOM from "react-dom/client";
import App from './App';
import HMRProvider from "./contexts/HMRContext";
import { HashRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <HMRProvider>
      <Router>
        <App />
      </Router>
    </HMRProvider>
  </React.StrictMode>
);

export default root;
