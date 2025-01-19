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

import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
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
import { userData } from '../../stores/UserDataStore';
import { observer } from 'mobx-react-lite';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';


const ProfilePage: React.FC = observer(() => {
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
        // console.log('Premium button clicked');
    };

    // Массив фотографий профиля
    const photos = [userData.getPhoto(), ...userData.getAdditionalPhotos()].filter(photo => photo !== "");

    // Данные для секции "Main Features"
    const mainFeatures = [
        { text: `${userData.getHeight()} cm`, icon: <StraightenIcon /> },
        { text: `${userData.getWeight()} kg`, icon: <MonitorWeightIcon /> },
        { text: `${userData.getWorldview()}`, icon: <ChurchIcon /> },
        { text: `${userData.getZodiac()}`, icon: <Typography sx={{ fontSize: 20 }}>♈️</Typography> },
        { text: `${userData.getChildren()}`, icon: <ChildCareIcon /> },
        { text: `${userData.getAlcohol()}`, icon: <LocalBarIcon /> },
        { text: `${userData.getSmoking()}`, icon: <SmokingRoomsIcon /> },
    ];

    if (userData.loading) {
        return <CircularProgress />; // Show a loading spinner while data is being fetched
    }

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            {/* Заголовок с кнопкой настроек поверх фотографии */}
            <Box width="100%" bgcolor="transparent" display="flex" justifyContent="space-between" alignItems="center" p={2} position="absolute" top={0} zIndex={2}>
                <Typography variant="h4"
                align="center"
                gutterBottom
                sx={{
                    color: "white", 
                    fontFamily: "'Poppins', Arial, sans-serif",
                    fontWeight: 600,
                }}>Профиль</Typography>
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
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{userData.getUsername()}, {userData.getAge()}</Typography>
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
                        Краткая информация
                    </Typography>
                    <Box sx={{ border: '1px solid #ddd', borderRadius: '8px', padding: 2 }}>
                        <Typography variant="body1" textAlign="left">
                            {userData.getBio()}
                        </Typography>
                    </Box>
                </Box>

                {/* Секция Main Features */}
                <Box mt={2} width="100%">
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Основные характеристики
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
                        Интересы
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                        {userData.getInterests().map((interestName, index) => (
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
                                <Typography>{interestName}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Секция Languages */}
                <Box mt={2} width="100%">
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Языки
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                        {(userData.getLanguages() || []).map((language, index) => (
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
                                <Typography>{language}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Кнопка Premium */}
                <Box mt={4} width="100%" display="flex" justifyContent="center" pb={8}>
                    <RoundButton onClick={handlePremiumClick}>Премиум</RoundButton>
                </Box>
            </Box>

            {/* Навигационная панель */}
            <Box width="100%" position="fixed" bottom={0} left={0} zIndex={2} bgcolor="white">
                <NavBar />
            </Box>
        </Box>
    );
});

export default ProfilePage;
