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
import { Box, Typography, Avatar, Paper, IconButton, Chip, Button, Modal, CircularProgress } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import RoundButton from '../basic/RoundButton';
import EditableField from '../basic/EditableField';
import TargetSheetButton from '../basic/TargetSheetButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WineBarIcon from '@mui/icons-material/WineBar';
import PeopleIcon from '@mui/icons-material/People';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MultiCategorySheetButton, { CategoryOption } from '../basic/MultiCategorySheetButton';
import { useNavigate } from 'react-router-dom';
import { logEvent, logPageView } from '../../analytics';
import { userData } from '../../stores/UserDataStore';
import { observer } from 'mobx-react-lite';
import { fetchTags } from '../../api/register';
import { Tag } from "../../types";



const relationshipIds = [
    { id: "672b44eab151637e969889bb", label: 'Dates', icon: <WineBarIcon /> },
    { id: "672b44eab151637e969889bc", label: 'Romantic relationships', icon: <FavoriteBorderIcon /> },
    { id: "672b44eab151637e969889bd", label: 'Friendship', icon: <PeopleIcon /> },
    { id: "672b44eab151637e969889be", label: 'Casual Chat', icon: <ChatBubbleOutlineIcon /> },
];

const galleryImages: string[] = [
    'images/profile_photo1.png',
    'images/profile_photo2.jpg',
    'images/profile_photo3.jpg',
    '',
    '',
    ''
];


const EditProfilePage: React.FC = observer(() => {
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);

    const relation = relationshipIds.find(p => p.id === userData.getRelationshipPreference())
    const [selectedTarget, setSelectedTarget] = useState<{ label: string; icon: JSX.Element }>(relation ? relation : relationshipIds[0]);
    const [, setSelectedFeatures] = useState<{ [key: string]: string | string[] }>({});
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>(userData.getInterestIDs() || []);
    const [loadingTags, setLoadingTags] = useState<boolean>(true);

    const targetOptions = [
        { ...relationshipIds[0], description: 'Looking for dates', onClick: () => handleTargetSelect(relationshipIds[0]) },
        { ...relationshipIds[1], description: 'Looking for romantic relationships', onClick: () => handleTargetSelect(relationshipIds[1]) },
        { ...relationshipIds[2], description: 'Looking for friendship', onClick: () => handleTargetSelect(relationshipIds[2]) },
        { ...relationshipIds[3], description: 'Looking for casual chat', onClick: () => handleTargetSelect(relationshipIds[3]) },
    ];

    const categoriesConfig: CategoryOption[] = [
        { label: 'Height', type: 'slider', min: 100, max: 250, onConfirm: v => userData.setHeight(v), selectedValue: userData.getHeight() },
        { label: 'Weight', type: 'slider', min: 40, max: 200, onConfirm: v => userData.setWeight(v), selectedValue: userData.getWeight() },
        { label: 'Worldview', type: 'select', options: ['Buddhism', 'Jewry', 'Hinduism', 'Islam', 'Catholicism', 'Confucianism', 'Orthodoxy', 'Protestantism', 'Secular humanism', 'Atheism', 'Agnosticism'], onConfirm: v => userData.setWorldview(v), selectedValue: userData.getWorldview() },
        { label: 'Zodiac Sign', type: 'buttonSelect', options: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces', 'None'], onConfirm: v => userData.setZodiac(v), selectedValue: userData.getZodiac() },
        { label: 'Children', type: 'buttonSelect', options: ['No and not planning', 'No but would like', 'Already have'], onConfirm: v => userData.setChildren(v), selectedValue: userData.getChildren() },
        { label: 'Languages', type: 'languageSelect', onConfirm: v => userData.setLanguages(v), selectedValue: userData.getLanguages() },
        { label: 'Alcohol', type: 'buttonSelect', options: ['Strongly Negative', 'Neutral', 'Positive'], onConfirm: v => userData.setAlcohol(v), selectedValue: userData.getAlcohol() },
        { label: 'Smoking', type: 'buttonSelect', options: ['Strongly Negative', 'Neutral', 'Positive'], onConfirm: v => userData.setSmoking(v), selectedValue: userData.getSmoking() },
    ];


    useEffect(() => {
        logPageView('/edit-profile');
    }, []);

    useEffect(() => {
        const loadTags = async () => {
            try {
                const tags = await fetchTags();
                setAllTags(tags);
            } catch (err: any) {
                console.error("Error fetching tags: ", err)
            } finally {
                setLoadingTags(false);
            }
        };

        loadTags();
    }, [])

    const handleDeleteImage = (index: number) => {
        console.log(`Delete image at index ${index}`);
    };

    const handleEditImage = (index: number) => {
        console.log(`Edit image at index ${index}`);
    };

    const handleTargetSelect = (option: { label: string; icon: JSX.Element }) => {
        setSelectedTarget(option);
        const prefId = relationshipIds.find(p => p.label == option.label);
        if (prefId) {
            userData.setRelationshipPreference(prefId.id);
        }
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

    const handleInterestSelect = (tagId: string) => {
        setSelectedTags((prev) =>
            prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
        );
    };

    const applyInterests = () => {
        userData.setInterests(selectedTags);
        setModalOpen(false);
    };

    if (userData.loading) {
        return <CircularProgress />; // Show a loading spinner while data is being fetched
    }

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
                    <EditableField label="Username" initialValue={userData.getUsername()} onSave={(v) => userData.setUsername(v)} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>Age: {userData.getAge()} yo</Typography>
                </Box>
                <EditableField label="Bio" initialValue={userData.getBio()} onSave={(v) => userData.setBio(v)} />

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
                <Box p={3}>
                    {/* Заголовок */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Интересы</Typography>

                    {/* Интересы */}
                    <Paper
                        variant="outlined"
                        onClick={() => setModalOpen(true)}
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: 'grey.100' },
                        }}
                    >
                        {Object.keys(selectedTags).length === 0 ? (
                            <Box>
                                <Typography sx={{ fontWeight: 'bold' }}>Добавьте свои интересы</Typography>
                                <Typography sx={{ color: 'grey.600' }}>Расскажите, чем вы увлекаетесь и что вам нравится</Typography>
                            </Box>
                        ) : (
                            <Box display="flex" flexWrap="wrap" gap={1}>
                                {selectedTags.map(tagId => {
                                    const foundTag = allTags.find(t => t.id === tagId);
                                    if (!foundTag) return null;

                                    return (
                                        <Chip
                                            key={tagId}
                                            label={foundTag.text}
                                            onDelete={() => handleInterestSelect(tagId)}
                                        />
                                    );
                                })}
                            </Box>

                        )}
                        <ChevronRightIcon />
                    </Paper>

                    {/* Модальное окно для выбора интересов */}
                    <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
                        <Paper
                            sx={{
                                width: '90%',
                                maxWidth: '400px',
                                margin: '10% auto',
                                p: 3,
                                borderRadius: 2,
                                outline: 'none',
                                maxHeight: '80vh',
                                overflowY: 'auto',
                                boxShadow: 24,
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                                Выберите интересы
                            </Typography>

                            {/* Перебор категорий */}
                            {loadingTags ? (
                                <Typography>Загрузка интересов...</Typography>
                            ) : (
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                    {allTags.map(tag => (
                                        <Button
                                            key={tag.id}
                                            variant={
                                                selectedTags.includes(tag.id) ? 'contained' : 'outlined'
                                            }
                                            onClick={() => handleInterestSelect(tag.id)}
                                        >
                                            {tag.text}
                                        </Button>
                                    ))}
                                </Box>
                            )}

                            <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={applyInterests}>
                                Применить
                            </Button>
                        </Paper>
                    </Modal>



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
});

export default EditProfilePage;
