import React from 'react';
import {Box, Typography, Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '../../contexts/PremiumContext';

const PremiumPage: React.FC = () => {
    const { setPremium } = usePremium();
    const navigate = useNavigate();

    const handleBuy = () => {
        setPremium(true); // update profile
        navigate('/profile');
    };

    return (
        <Box sx={{ p: 4, textAlign: 'center'}}>
            <Typography variant='h4' sx={{ mb: 3}}>
                Это премиум. Вау!
            </Typography>
            <Typography variant='body1' sx={{ mb: 3}}>
                Получи (нет) доступ к экслюзивным функциям:
            </Typography>
            <ul>
                <li>Суперлайк</li>
                <li>Просмотр своих лайков</li>
                <li>Больше фильтров</li>
                <li>Что нибудь еще, главное дай деняккк</li>
            </ul>
            <Button variant='contained' color='primary' onClick={handleBuy}>
                Купить премиум
            </Button>
        </Box>
    );
};

export default PremiumPage;