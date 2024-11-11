import React from "react";
import ReactDOM from "react-dom/client";
import App from './App';
import HMRProvider from "./contexts/HMRContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <HMRProvider>
            <App />
        </HMRProvider>
    </React.StrictMode>
);

export default root;
