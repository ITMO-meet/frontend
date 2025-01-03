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
import MultiCategorySheetButton from '../basic/MultiCategorySheetButton';
import { useNavigate } from 'react-router-dom';
import { logEvent, logPageView } from '../../analytics';
import { userData } from '../../stores/UserDataStore';

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

const interestCategories = [
    {
        label: 'Спорт и активный отдых',
        options: [
            { name: 'Бег', emoji: '🏃‍♂️' },
            { name: 'Плавание', emoji: '🏊‍♀️' },
            { name: 'Йога', emoji: '🧘‍♀️' },
            { name: 'Велоспорт', emoji: '🚴‍♀️' },
            { name: 'Спортзал', emoji: '🏋️‍♂️' },
            { name: 'Лыжи', emoji: '🎿' },
            { name: 'Сноуборд', emoji: '🏂' },
            { name: 'Танцы', emoji: '💃' },
            { name: 'Боевые искусства', emoji: '🥋' },
            { name: 'Серфинг', emoji: '🏄‍♂️' },
            { name: 'Хайкинг', emoji: '🏕️' },
            { name: 'Теннис', emoji: '🎾' },
            { name: 'Скалолазание', emoji: '🧗‍♀️' },
        ],
    },
    {
        label: 'Образование и саморазвитие',
        options: [
            { name: 'Изучение языков', emoji: '🔖' },
            { name: 'Научные лекции', emoji: '🎓' },
            { name: 'Онлайн-курсы', emoji: '💻' },
            { name: 'Самообразование', emoji: '📚' },
            { name: 'Медитация', emoji: '🧘' },
            { name: 'Психология', emoji: '🧠' },
            { name: 'Философия', emoji: '📜' },
            { name: 'История', emoji: '🏺' },
            { name: 'Чтение', emoji: '📖' },
            { name: 'Технологии', emoji: '💻' },
        ],
    },
    {
        label: 'Хобби и развлечения',
        options: [
            { name: 'Литература', emoji: '📚' },
            { name: 'Видеоигры', emoji: '🎮' },
            { name: 'Настольные игры', emoji: '🎲' },
            { name: 'Путешествия', emoji: '🌍' },
            { name: 'Выращивание растений', emoji: '🪴' },
            { name: 'Рыбалка', emoji: '🎣' },
            { name: 'Прогулки с собаками', emoji: '🐕' },
            { name: 'Любитель кошек', emoji: '🐈' },
            { name: 'Автомобили и мотоциклы', emoji: '🏎️' },
        ],
    },
    {
        label: 'Гастрономия',
        options: [
            { name: 'Готовка', emoji: '🍳' },
            { name: 'Любитель вин', emoji: '🍷' },
            { name: 'Тур по барам', emoji: '🍻' },
            { name: 'Кофейный эксперт', emoji: '☕' },
            { name: 'Чайные церемонии', emoji: '🍵' },
            { name: 'Вегетарианская кухня', emoji: '🥗' },
            { name: 'Ресторанный критик', emoji: '🍽️' },
            { name: 'Любитель сладкого', emoji: '🍰' },
        ],
    },
    {
        label: 'Творчество и искусство',
        options: [
            { name: 'Живопись', emoji: '🎨' },
            { name: 'Фотография', emoji: '📸' },
            { name: 'Музыка', emoji: '🎵' },
            { name: 'Пение', emoji: '🎤' },
            { name: 'Писательство', emoji: '✍️' },
            { name: 'Скульптура', emoji: '🗿' },
            { name: 'Театр', emoji: '🎭' },
            { name: 'Кино', emoji: '🎬' },
            { name: 'Рукоделие', emoji: '🧵' },
        ],
    },
];


type CategoryOption = SliderCategoryOption | SelectCategoryOption | ButtonSelectCategoryOption | LanguageSelectCategoryOption;

const EditProfilePage: React.FC = () => {
    const navigate = useNavigate();

    const [isModalOpen, setModalOpen] = useState(false);

    const [selectedTarget, setSelectedTarget] = useState<{ label: string; icon: JSX.Element }>({
        label: "Romantic relationships",
        icon: <FavoriteBorderIcon />,
    });
    const [, setSelectedFeatures] = useState<{ [key: string]: string | string[] }>({});

    useEffect(() => {
        logPageView('/edit-profile');
    }, []);

    useEffect(() => {
        const storedInterests = localStorage.getItem('selectedInterests');
        if (storedInterests) {
            setSelectedInterests(JSON.parse(storedInterests));
        }
    }, []);

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

    const [selectedInterests, setSelectedInterests] = useState<{ [key: string]: string }>({});

    const handleInterestSelect = (category: string, interest: string, emoji: string) => {
        setSelectedInterests((prev) => {
            const updatedInterests = { ...prev, [category]: `${emoji} ${interest}` };
            localStorage.setItem('selectedInterests', JSON.stringify(updatedInterests));
            return updatedInterests;
        });
    };

    const handleInterestRemove = (category: string) => {
        setSelectedInterests((prev) => {
            const updated = { ...prev };
            delete updated[category];
            return updated;
        });
    };

    if (userData.loading) {
        return <CircularProgress  />; // Show a loading spinner while data is being fetched
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
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>{userData.getUsername()}, {userData.getAge()}</Typography>
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
                {Object.keys(selectedInterests).length === 0 ? (
                    <Box>
                        <Typography sx={{ fontWeight: 'bold' }}>Добавьте свои интересы</Typography>
                        <Typography sx={{ color: 'grey.600' }}>Расскажите, чем вы увлекаетесь и что вам нравится</Typography>
                    </Box>
                ) : (
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {Object.entries(selectedInterests).map(([category, interest]) => (
                            <Chip
                                key={category}
                                label={interest}
                                onDelete={() => handleInterestRemove(category)}
                                deleteIcon={<CloseIcon />}
                                sx={{ fontSize: '14px' }}
                            />
                        ))}
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
        {interestCategories.map((category) => (
            <Box key={category.label} mb={3}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {category.label}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                    {/* Кнопки интересов */}
                    {category.options.map((interest) => (
                        <Button
                            key={interest.name}
                            variant={
                                selectedInterests[category.label] === `${interest.emoji} ${interest.name}`
                                    ? 'contained'
                                    : 'outlined'
                            }
                            size="small"
                            onClick={() => handleInterestSelect(category.label, interest.name, interest.emoji)}
                            sx={{
                                textTransform: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                backgroundColor:
                                    selectedInterests[category.label] === `${interest.emoji} ${interest.name}`
                                        ? 'rgba(25, 118, 210, 0.1)'
                                        : 'transparent',
                                borderColor:
                                    selectedInterests[category.label] === `${interest.emoji} ${interest.name}`
                                        ? '#1976D2'
                                        : 'rgba(0, 0, 0, 0.23)',
                                color:
                                    selectedInterests[category.label] === `${interest.emoji} ${interest.name}`
                                        ? '#1976D2'
                                        : 'inherit',
                                '&:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.15)',
                                    borderColor: '#1976D2',
                                    color: '#1976D2',
                                },
                            }}
                        >
                            {interest.emoji} {interest.name}
                        </Button>
                    ))}
                </Box>
            </Box>
        ))}

        {/* Кнопка "Применить" */}
        <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            onClick={() => setModalOpen(false)}
        >
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
};

export default EditProfilePage;
