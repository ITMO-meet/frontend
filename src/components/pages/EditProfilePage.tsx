/**
 * Компонент EditProfilePage
 * 
 * Этот компонент представляет страницу редактирования профиля, где пользователь может:
 * - Просматривать и редактировать свою биографию и цели пребывания в приложении знакомств.
 * - Выбирать различные основные параметры (например, рост, мировоззрение, знак зодиака) с помощью различных методов ввода.
 * - Выбирать несколько интересов из заранее заданного списка.
 * - Управлять своей фотогалереей с возможностью редактировать или удалять изображения.
 * - Доступ к кнопке "Премиум" для дополнительного функционала (например, подписки на премиум).
 *
 * Компонент разделен на несколько секций, каждая из которых выполняет свою конкретную функцию:
 * - Заголовок: Отображает кнопку "Назад", которая отправляет на страницу ProfilePage.
 * - Биография: Позволяет пользователю редактировать краткую биографию.
 * - Цель: Позволяет выбрать цель или предпочтения в отношениях.
 * - Основные параметры: Предоставляет выбор различных категорий (например, рост, мировоззрение) с использованием различных типов ввода.
 * - Интересы: Позволяет выбрать интересы из списка.
 * - Галерея: Отображает сетку изображений с возможностью редактирования и удаления.
 * - Кнопка "Премиум": Кнопка внизу страницы для продвижения премиум-функций.
 */

/*TODO: 1. Добавить навигацию на кнопку назад в хэдере
        2. Цель пребывания изначально подгружается с реги, потом можно изменять через эту страницу
        3. Все Main Featchers подгружаются изначально с реги, но учти, что Знак Зодиака подгружается из даты рождения, 
        которая в свою очередь подгружается из ITMO.id
        4. Interests тоже изначально подгружаются из реги, потом можно менять через эту страницу
        5. Фотки подгружаются из реги, можно менять через эту страницу (можно удалить, А ПОТОМ В ПУСТОЕ МЕСТО загрузить новое фото)...
        ..также можешь реализовать штуку, когда ты перетаскиваешь фото, чтобы поменять их местами, но это НЕопционально, просто прикольно
        в качестве доп анимашки 
        6. Добавить навигацию на кнопку Premium на страницу PremiumPage 
*/

import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Paper, IconButton } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import RoundButton from '../basic/RoundButton';
import MultiSelectButtonGroup from '../basic/MultiSelectButtonGroup';
import EditableField from '../basic/EditableField';
import TargetSheetButton from '../basic/TargetSheetButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WineBarIcon from '@mui/icons-material/WineBar';
import PeopleIcon from '@mui/icons-material/People';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MultiCategorySheetButton from '../basic/MultiCategorySheetButton';
import { useNavigate } from 'react-router-dom';
import { logPageView, logEvent } from '../../analytics';

interface SliderCategoryOption {
    label: string;
    type: 'slider';
    min: number;
    max: number;
}

interface SelectCategoryOption {
    label: string;
    type: 'select';
    options: string[];
}

interface ButtonSelectCategoryOption {
    label: string;
    type: 'buttonSelect';
    options: string[];
}

interface LanguageSelectCategoryOption {
    label: string;
    type: 'languageSelect';
}

type CategoryOption = SliderCategoryOption | SelectCategoryOption | ButtonSelectCategoryOption | LanguageSelectCategoryOption;

const EditProfilePage: React.FC = () => {
    const navigate = useNavigate();

    const [selectedTarget, setSelectedTarget] = useState<{ label: string; icon: JSX.Element }>({
        label: "Romantic relationships",
        icon: <FavoriteBorderIcon />,
    });
    const [, setSelectedFeatures] = useState<{ [key: string]: string | string[] }>({});

    useEffect(() => { logPageView("/edit-profile") }, []);

    const handleInterestClick = (selectedOpts: string[]) => {
        console.log('Selected interests:', selectedOpts);
    };

    const handleDeleteImage = (index: number) => {
        console.log(`Delete image at index ${index}`);
    };

    const handleEditImage = (index: number) => {
        console.log(`Edit image at index ${index}`);
    };

    const handleTargetSelect = (option: { label: string; icon: JSX.Element }) => {
        setSelectedTarget(option);
        console.log('Selected target:', option.label);
    };

    const handleSave = (category: string, option: string | string[]) => {
        setSelectedFeatures((prev) => ({
            ...prev,
            [category]: option,
        }));
        console.log(`Selected ${category}: ${Array.isArray(option) ? option.join(', ') : option}`);
    };

    const handlePremiumClick = () => {
        logEvent("Profile", "To premium click", "Premium Button")
        navigate('/premium');
        console.log('Premium button clicked from edit');
    }

    const targetOptions = [
        { icon: <WineBarIcon />, label: 'Dates', description: 'Looking for dates', onClick: () => handleTargetSelect({ icon: <WineBarIcon />, label: 'Dates' }) },
        { icon: <FavoriteBorderIcon />, label: 'Romantic relationships', description: 'Looking for romantic relationships', onClick: () => handleTargetSelect({ icon: <FavoriteBorderIcon />, label: 'Romantic relationships' }) },
        { icon: <PeopleIcon />, label: 'Friendship', description: 'Looking for friendship', onClick: () => handleTargetSelect({ icon: <PeopleIcon />, label: 'Friendship' }) },
        { icon: <ChatBubbleOutlineIcon />, label: 'Casual Chat', description: 'Looking for casual chat', onClick: () => handleTargetSelect({ icon: <ChatBubbleOutlineIcon />, label: 'Casual Chat' }) },
    ];

    const categoriesConfig: CategoryOption[] = [
        { label: 'Height', type: 'slider', min: 100, max: 250 },
        { label: 'Worldview', type: 'select', options: ['Buddhism', 'Jewry', 'Hinduism', 'Islam', 'Catholicism', 'Confucianism', 'Orthodoxy', 'Protestantism', 'Secular humanism', 'Atheism', 'Agnosticism'] },
        { label: 'Zodiac Sign', type: 'buttonSelect', options: ['Aries', 'Do Not Display'] },
        { label: 'Children', type: 'buttonSelect', options: ['No and not planning', 'No but would like', 'Already have'] },
        { label: 'Languages', type: 'languageSelect' },
        { label: 'Alcohol', type: 'buttonSelect', options: ['Strongly Negative', 'Neutral', 'Positive'] },
        { label: 'Smoking', type: 'buttonSelect', options: ['Strongly Negative', 'Neutral', 'Positive'] },
    ];

    const galleryImages: string[] = [
        'images/profile_photo1.png',
        'images/profile_photo2.jpg',
        'images/profile_photo3.jpg',
        '',
        '',
        ''
    ];

    return (
        <Box position="relative" minHeight="100vh" display="flex" flexDirection="column">
            {/* Header */}
            <Box width="100%" color="white" display="flex" alignItems="center" p={2}>
                <IconButton data-testid="BackToProfile" onClick={() => navigate('/profile')} sx={{ color: 'grey.800' }}>
                    <WestIcon />
                </IconButton>
            </Box>

            <Box
                component={Paper}
                elevation={3}
                sx={{
                    mt: 0,
                    width: '100%',
                    borderRadius: '16px 16px 0 0',
                    padding: 3,
                    backgroundColor: '#ffffff',
                    zIndex: 1,
                    overflowY: 'auto',
                    flexGrow: 1,
                    paddingBottom: '80px',
                }}
            >
                {/* Bio Section */}
                <Box display="flex" flexDirection="column">
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>Alisa Pipisa, 20</Typography>
                </Box>
                <EditableField label="Bio" initialValue="My name is Jessica Parker, and I enjoy meeting new people and finding ways to help them have an uplifting experience. I enjoy reading..." />

                {/* Target Section */}
                <Box mt={2} width="100%">
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Target</Typography>
                    <TargetSheetButton label={selectedTarget.label} icon={selectedTarget.icon} options={targetOptions} onSelect={handleTargetSelect} />
                </Box>

                {/* Main Features Section */}
                <Box mt={2} width="100%">
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Main Features</Typography>
                    {categoriesConfig.map((category, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                            <MultiCategorySheetButton
                                label={`Choose ${category.label}`}
                                category={category}
                                onSave={handleSave}
                            />
                        </Box>
                    ))}
                </Box>

                {/* Interests Section */}
                <Box mt={2} width="100%">
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Interests</Typography>
                    <Box>
                        <MultiSelectButtonGroup
                            options={['Traveling', 'Books', 'Music', 'Dancing', 'Modeling', 'Coffee', 'Rave', 'Hiking']}
                            onClickOption={handleInterestClick}
                        />
                    </Box>
                </Box>

                {/* Gallery Section */}
                <Box mt={3} width="100%">
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Gallery</Typography>
                    <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1} justifyContent="center">
                        {galleryImages.map((src, index) => (
                            <Box key={index} position="relative">
                                <Avatar
                                    variant="rounded"
                                    src={src || undefined}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        bgcolor: src ? 'transparent' : 'grey.300',
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => src ? handleDeleteImage(index) : handleEditImage(index)}
                                    sx={{
                                        position: 'absolute',
                                        top: 4,
                                        right: 4,
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        color: 'black'
                                    }}
                                >
                                    {src ? <CloseIcon fontSize="small" /> : <EditIcon fontSize="small" />}
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Premium Button Section */}
                <Box mt={4} width="100%" display="flex" justifyContent="center" pb={8}>
                    <RoundButton onClick={handlePremiumClick}>Premium</RoundButton>
                </Box>
            </Box>
        </Box>
    );
};

export default EditProfilePage;
