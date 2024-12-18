// src/contexts/ErrorContext.tsx
// Глобальный контекст для обработки ошибок и вывода их пользователю через Snackbar.
// Компоненты вызывают showError при ошибках API.
// ErrorProvider оборачивает все приложение.

import React, { createContext, useState, useCallback, useContext } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface ErrorContextValue {
    showError: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [open, setOpen] = useState(false);

    const showError = useCallback((message: string) => {
        setErrorMessage(message);
        setOpen(true);
    }, []);

    const handleClose = () => setOpen(false);

    return (
        <ErrorContext.Provider value={{showError}}>
            {children}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </ErrorContext.Provider>
    );
};

export function useError() {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error("useError must be used within an ErrorProvider");
    }
    return context;
}
