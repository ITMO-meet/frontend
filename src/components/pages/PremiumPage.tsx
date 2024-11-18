import React from 'react';
import {Box, Typography, Button, IconButton} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '../../contexts/PremiumContext';
import WestIcon from '@mui/icons-material/West'

const PremiumPage: React.FC = () => {
    const { setPremium } = usePremium();
    const navigate = useNavigate();

    const handleBuy = () => {
        setPremium(true); // update profile
        navigate('/profile');
    };

    return (
        <Box sx={{ p: 4, textAlign: 'center'}}>
            {/* Back button */}
            <Box display="flex" justifyContent="flex-start" mb={3}>
                <IconButton onClick={() => navigate('/profile')} sx={{ color: 'grey.800' }}>
                    <WestIcon />
                </IconButton>
            </Box>

            {/* Описание */}
            <Typography variant='h4' sx={{ mb: 2, fontWeight: 'bold'}}>
                Это премиум. Вау!
            </Typography>

            {/* Цена */}
            <Typography
                variant='h6'
                sx={{
                    color: '#444',
                    fontSize: '18px',
                    fontWeight: '500',
                    mb: '4',
                }}
            >
                10 $/месяц
            </Typography>
            
            {/* Преимущества */}
            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: '12px',
                    p: 3,
                    textAlign: 'left',
                    mb: 3,
                }}
            >
                <Typography
                    variant='h6'
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '20px',
                        mb: 2,
                        textAlign: 'center',
                    }}
                >
                    Получи (нет) доступ к экслюзивным функциям:
                </Typography>

                <ul
                    style={{
                        padding: 0,
                        listStyle: 'none',
                        fontSize: '16px',
                        lineHeight: '1.8',
                    }}
                >
                    <li>Суперлайк</li>
                    <li>Просмотр своих лайков</li>
                    <li>Больше фильтров</li>
                    <li>Что нибудь еще, главное дай деняккк</li>
                </ul>

                <Box textAlign="center" mt={3}>
                    <Button
                        variant='contained'
                        sx={{
                            backgroundColor: '#FFD700',
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: '20px',
                            px: 5,
                            py: 1.5,
                        
                        }}
                        onClick={handleBuy}
                    >
                        Купить премиум
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default PremiumPage;