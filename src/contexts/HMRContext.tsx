import React, { createContext, useEffect } from 'react'
import {getConfig} from "../api/config";

type Props = {
    children?: React.ReactNode,
}

const HMRContext = createContext(null);

const HMRProvider = ({ children }: Props) => {
    useEffect(() => {
        if (process.env.NODE_ENV !== "production") {
            const { HMR_URL } = getConfig();
            const eventSource = new EventSource(HMR_URL);
            eventSource.addEventListener('change', (event) => {
                const updatedFiles = JSON.parse(event.data);

                if (updatedFiles.updated.length > 0) {
                    location.reload();
                }
            });

            eventSource.onerror = (error) => {
                console.error('EventSource error:', error);
            };

            return () => {
                eventSource.close();
            };
        }
    }, []);

    return (
        <HMRContext.Provider value={null}>
            {children}
        </HMRContext.Provider>
    )
}

export default HMRProvider
