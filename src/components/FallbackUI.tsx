import React from "react";
import { Box, Typography, ThemeProvider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RoundButton from "./basic/RoundButton";
import theme from "./theme";

interface Props {
    error: Error | null;
    resetError: () => void;
}

export const FallbackUI: React.FC<Props> = ({ resetError }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        resetError();
        navigate("/profile");
    }

    return (
        <ThemeProvider theme={theme}>
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
            <RoundButton
                sx={{
                    fontSize: '1.1rem', // Увеличенный размер текста
                    fontWeight: 700, // Жирный текст
                    fontFamily: "'Poppins', Arial, sans-serif",
                    letterSpacing: '0.05em', // Расширение текста
                    padding: '10px 20px', // Увеличенный внутренний отступ
                }}
                onClick={handleClick} // Обработчик клика по кнопке
            >
                Вернуться на главную
            </RoundButton>
        </Box>
        </ThemeProvider>
    );
};
