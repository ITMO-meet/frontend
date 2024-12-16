/**
 * ProfilePage компонент отображает профиль пользователя с различными секциями:
 * - Заголовок с кнопкой настроек
 * - Галерея фотографий пользователя
 * - Основное содержимое профиля, включающее:
 *   - Основную информацию (имя, возраст и кнопку редактирования)
 *   - Био пользователя
 *   - Основные особенности (Main Features)
 *   - Интересы (Interests)
 *   - Языки, на которых говорит пользователь (Languages)
 * - Кнопка Premium, которая предоставляет доступ к премиум-функциям
 * - Навигационная панель внизу экрана
 * 
 * Параметры:
 * - Фотографии профиля пользователя
 * - Информация об основных особенностях, интересах и языках
 * - Обработчики событий для кнопок редактирования и настроек
 * 
 * Использование:
 * - Компонент предназначен для отображения профиля пользователя с возможностью редактирования.
 */

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import StraightenIcon from '@mui/icons-material/Straighten';
import ChurchIcon from '@mui/icons-material/Church';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import { useNavigate } from 'react-router-dom';
import RoundButton from '../basic/RoundButton';
import ImageButton from '../basic/ImageButton';
import NavBar from '../basic/NavBar';
import PhotoListing from '../basic/PhotoListing';
import { usePremium } from '../../contexts/PremiumContext';
import { logEvent, logPageView } from '../../analytics';

const ProfilePage: React.FC = () => {
    const { isPremium } = usePremium();
    const navigate = useNavigate();

    useEffect(() => { logPageView("/profile"); }, []);

    // Обработчик для перехода на страницу редактирования профиля
    const handleEditClick = () => {
        logEvent("Profile", "To profile edit", "Edit Profile Button")
        navigate('/edit-profile');
    };

    // Обработчик для нажатия кнопки Premium
    const handlePremiumClick = () => {
        logEvent("Profile", "To premium click", "Premium Button")
        navigate('/premium');
        console.log('Premium button clicked');
    };

    // Массив фотографий профиля
    const photos = [
        '/images/profile_photo1.png',
        '/images/profile_photo2.jpg',
        '/images/profile_photo3.jpg',
    ];

    // Данные для секции "Main Features"
    const mainFeatures = [
        { text: '170 cm', icon: <StraightenIcon /> },
        { text: 'Atheism', icon: <ChurchIcon /> },
        { text: 'Aries', icon: <Typography sx={{ fontSize: 20 }}>♈️</Typography> },
        { text: 'No but would like', icon: <ChildCareIcon /> },
        { text: 'Neutral', icon: <LocalBarIcon /> },
        { text: 'Neutral', icon: <SmokingRoomsIcon /> },
    ];

    // Данные для секции "Interests"
    const [interests, setInterests] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const storedInterests = localStorage.getItem('selectedInterests');
        if (storedInterests) {
            setInterests(JSON.parse(storedInterests));
        }
    }, []);

    // Данные для секции "Languages"
    const languages = [
        { text: 'English', flagCode: 'us' },
        { text: 'Russian', flagCode: 'ru' },
    ];

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            {/* Заголовок с кнопкой настроек поверх фотографии */}
            <Box width="100%" bgcolor="transparent" display="flex" justifyContent="space-between" alignItems="center" p={2} position="absolute" top={0} zIndex={2}>
                <Typography variant="h5" color="white">Profile</Typography>
                <ImageButton onClick={() => navigate('/settings')} >
                    <SettingsIcon sx={{ color: 'rgba(52, 87, 169)' }} />
                </ImageButton>
            </Box>

            {/* Галерея фотографий пользователя */}
            <PhotoListing photos={photos} />

            {/* Основное содержимое профиля */}
            <Box p={3} sx={{ backgroundColor: '#ffffff', flexGrow: 1, zIndex: 1 }}>
                {/* Основная информация с кнопкой редактирования */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Alisa Pipisa, 20</Typography>
                    <ImageButton onClick={handleEditClick}>
                        <EditIcon />
                    </ImageButton>
                </Box>

                {/* Премиум-пометка */}
                {isPremium && (
                    <Box mt={2} p={2} sx={{ backgroundColor: '#FFD700', borderRadius: '8px', textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#000' }}>У вас премиум-аккаунт!
                        </Typography>
                    </Box>
                )}

                {/* Секция Bio */}
                <Box mt={2} width="100%">
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Bio
                    </Typography>
                    <Box sx={{ border: '1px solid #ddd', borderRadius: '8px', padding: 2 }}>
                        <Typography variant="body1" textAlign="left">
                            My name is Alisa Pipisa, and I enjoy meeting new people and finding ways to help them have an uplifting experience. I enjoy reading...
                        </Typography>
                    </Box>
                </Box>

                {/* Секция Main Features */}
                <Box mt={2} width="100%">
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Main Features
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                        {mainFeatures.map((item, index) => (
                            <Box
                                key={index}
                                display="flex"
                                alignItems="center"
                                sx={{
                                    bgcolor: "rgba(214, 231, 255, 0.8)",
                                    border: "1px solid rgba(214, 231, 255, 0.8)",
                                    borderRadius: "8px",
                                    padding: "4px 8px",
                                    gap: "4px"
                                }}
                            >
                                {item.icon}
                                <Typography>{item.text}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Секция Interests */}
                <Box mt={2} width="100%">
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Interests
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
                {Object.values(interests).map((interest, index) => (
                    <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        sx={{
                            bgcolor: "rgba(214, 231, 255, 0.8)",
                            borderRadius: "8px",
                            padding: "4px 8px",
                            gap: "4px",
                        }}
                    >
                        <Typography>{interest}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>

                {/* Секция Languages */}
                <Box mt={2} width="100%">
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Languages
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                        {languages.map((language, index) => (
                            <Box
                                key={index}
                                display="flex"
                                alignItems="center"
                                sx={{
                                    bgcolor: "rgba(214, 231, 255, 0.8)",
                                    border: "1px solid rgba(214, 231, 255, 0.8)",
                                    borderRadius: "8px",
                                    padding: "4px 8px",
                                    gap: "4px"
                                }}
                            >
                                <Typography>{language.text}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Кнопка Premium */}
                <Box mt={4} width="100%" display="flex" justifyContent="center" pb={8}>
                    <RoundButton onClick={handlePremiumClick}>Premium</RoundButton>
                </Box>
            </Box>

            {/* Навигационная панель */}
            <Box width="100%" position="fixed" bottom={0} left={0} zIndex={2} bgcolor="white">
                <NavBar />
            </Box>
        </Box>
    );
};

export default ProfilePage;
