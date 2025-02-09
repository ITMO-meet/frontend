// src/contexts/NotificationContext.tsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import { Box, Paper, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

export interface Notification {
    id: string;
    senderName: string;
    senderPhoto: string;
    text: string;
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
    notificationsEnabled: boolean;
    setNotificationsEnabled: (enabled: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

    const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
        if (!notificationsEnabled) return;
        const id = generateId();
        setNotifications((prev) => [...prev, { id, ...notification }]);
        setTimeout(() => removeNotification(id), 5000);
    }, [notificationsEnabled]);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, notificationsEnabled, setNotificationsEnabled }}>
            {children}
            <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};

interface NotificationContainerProps {
    notifications: Notification[];
    removeNotification: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, removeNotification }) => {
    return (
        <AnimatePresence>
            <Box sx={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1500 }}>
                {notifications.map((n) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 }}
                        style={{ marginBottom: 8 }}
                    >
                        <Paper sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: '16px', minWidth: 300 }}>
                            <Box
                                component="img"
                                src={n.senderPhoto}
                                alt={n.senderName}
                                sx={{ width: 40, height: 40, borderRadius: '50%', mr: 1 }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">{n.senderName}</Typography>
                                <Typography variant="body2">{n.text}</Typography>
                            </Box>
                            <IconButton size="small" onClick={() => removeNotification(n.id)}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Paper>
                    </motion.div>
                ))}
            </Box>
        </AnimatePresence>
    );
};
