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
                    <IconButton onClick={handleBackClick} aria-label="back">
                        <WestIcon />
                    </IconButton>
                </Box>

                {/* Описание премиума */}
                <Typography variant="h4" mb={2} fontWeight="bold">Это премиум. Вау!</Typography>
                <Typography variant="h6" mb={3}>10 $/месяц</Typography>

                {/* Преимущества */}
                <Box textAlign="left" p={3} borderRadius="12px" bgcolor="#f5f5f5">
                    <Typography variant="h6" fontWeight="bold" mb={2} textAlign="center">
                        Получи доступ к эксклюзивным функциям:
                    </Typography>
                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                        <li>Суперлайк</li>
                        <li>Просмотр своих лайков</li>
                        <li>Больше фильтров</li>
                        <li>Что-нибудь еще</li>
                    </ul>
                </Box>

                {/* Кнопка покупки */}
                <Button
                    variant="contained"
                    sx={{ mt: 3, bgcolor: '#FFD700', color: '#000', fontWeight: 'bold' }}
                    onClick={handleBuy}
                >
                    Купить премиум
                </Button>
            </Box>
        </PageWrapper>
    );
};

export default PremiumPage;