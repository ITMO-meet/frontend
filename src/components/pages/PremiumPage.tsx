import React, { useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '../../contexts/PremiumContext';
import WestIcon from '@mui/icons-material/West'
import { logEvent, logPageView } from '../../analytics';
import PageWrapper from '../../PageWrapper';

const PremiumPage: React.FC = () => {
    const { setPremium } = usePremium();
    const navigate = useNavigate();
    useEffect(() => { logPageView("/premium") }, []);
    const handleBuy = () => {
        setPremium(true); // update profile
        logEvent("Premium", "Premium bought", "Premium Button");
        navigate('/profile');
    };

    const handleBackClick = () => {
        navigate('/profile');
    };

    return (
        <PageWrapper direction={1}>
            <Box p={4} textAlign="center">
                {/* Кнопка назад */}
                <Box display="flex" justifyContent="flex-start" mb={3}>
                    <IconButton onClick={handleBackClick} aria-label="back" sx={{
                    '&:active': {
                        backgroundColor: '#6a8afc', // Цвет при нажатии
                    },
                    borderRadius: '50%', // Круглая форма
                    }}>
                        <WestIcon />
                    </IconButton>
                </Box>

                {/* Описание премиума */}
                <Typography variant="h4" mb={2} fontWeight="bold" sx={{
                    color: '#4a4a4a', // Тёмно-серый цвет заголовка
                    fontFamily: "'Poppins', Arial, sans-serif",
                    fontWeight: 600,
                }}>Это премиум. Вау!</Typography>
                <Typography variant="h6" mb={3} sx={{
                    color: '#4a4a4a', // Тёмно-серый цвет заголовка
                    fontFamily: "'Poppins', Arial, sans-serif",
                    fontWeight: 600,
                }}>10 $/месяц</Typography>

                {/* Преимущества */}
                <Box textAlign="left" p={3} borderRadius="12px" bgcolor="#f5f5f5">
                    <Typography variant="h6" fontWeight="bold" mb={2} textAlign="center" sx={{
                    color: '#4a4a4a', // Тёмно-серый цвет заголовка
                    fontFamily: "'Poppins', Arial, sans-serif",
                    fontWeight: 600,
                }}>
                        Получи доступ к эксклюзивным функциям:
                    </Typography>
                    <ul style={{ listStyle: 'none', paddingLeft: 0,
                    color: '#4a4a4a', // Тёмно-серый цвет заголовка
                    fontFamily: "'Poppins', Arial, sans-serif",
                    fontWeight: 600,
                }}>
                        <li>Суперлайк</li>
                        <li>Просмотр своих лайков</li>
                        <li>Больше фильтров</li>
                        <li>Что-нибудь еще</li>
                    </ul>
                </Box>

                {/* Кнопка покупки */}
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#4d60bf', // Цвет кнопки
                        color: 'white', // Цвет текста
                        borderRadius: '30px', // Скруглённые края
                        textTransform: 'none', // Убрать CAPS
                        fontSize: '1.1rem', // Увеличенный размер текста
                        fontWeight: 700, // Жирный текст
                        fontFamily: "'Poppins', Arial, sans-serif",
                        letterSpacing: '0.05em', // Расширение текста
                        padding: '10px 20px', // Пространство внутри кнопки
                        '&:hover': { backgroundColor: '#1e4dc7' }, // Тёмный оттенок при наведении
                    }}
                    onClick={handleBuy}
                >
                    Купить премиум
                </Button>
            </Box>
        </PageWrapper>
    );
};

export default PremiumPage;