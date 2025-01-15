import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Props {
    error: Error | null;
    resetError: () => void;
}

export const FallbackUI: React.FC<Props> = ({ resetError }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        resetError();
        navigate("/");
    }

    return (
        <Box 
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center',
            }}
        >
            <Typography variant="h1" sx={{ fontSize: '100px', color: '#4a4a4a', // Тёмно-серый цвет заголовка
                        fontFamily: "'Poppins', Arial, sans-serif",
                        fontWeight: 600 }}>
                😵‍💫
            </Typography>
            <Typography variant="h4" sx={{ margin: '20px 0', color: '#4a4a4a', // Тёмно-серый цвет заголовка
                        fontFamily: "'Poppins', Arial, sans-serif",
                        fontWeight: 600 }}>
            Ой... Что-то не так
            </Typography>
            <Button 
                variant="contained" 
                onClick={handleClick} 
                sx={{ padding: '10px 20px', 
                        color: '#4a4a4a', // Тёмно-серый цвет заголовка
                        fontFamily: "'Poppins', Arial, sans-serif",
                        fontWeight: 600
                }}
            >
                Вернуться на главную
            </Button>
        </Box>
    );
};
