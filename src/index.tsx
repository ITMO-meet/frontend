import React from "react";
import ReactDOM from "react-dom/client";
import App from './components/App';
// import rollbar from './Rollbar';

// rollbar.info("Init message!");

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
