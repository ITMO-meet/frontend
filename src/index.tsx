// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from './App';
import HMRProvider from "./contexts/HMRContext";
import { HashRouter as Router } from 'react-router-dom';
import { postJson } from "./api/index";

async function registerServiceWorkerAndSubscribe() {
    try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('[index] Service Worker registered with scope:', registration.scope);

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            throw new Error('Permission not granted for Notification');
        }

        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            const vapidPublicKey = 'BASkftNNFfefx0q0BoY34yRP3EeayMr4NjIMG_bZ2Nyx4aGZax475_MsVv7XnAUTnGlNUGIgmzu5dlWHrzl3rCA';
            const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
            console.log('[index] Converted VAPID key length:', convertedVapidKey.length); // должно быть 65
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });
        }
        console.log('[index] Subscription:', subscription.toJSON());
        await postJson('/push/subscribe', subscription);
        console.log('[index] Подписка отправлена на сервер');
    } catch (err) {
        console.error('[index] Ошибка при подписке на push-уведомления:', err);
    }
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    window.addEventListener('load', () => {
        registerServiceWorkerAndSubscribe();
    });
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

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
