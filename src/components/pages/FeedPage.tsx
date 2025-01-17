import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Card,
    CardMedia,
    CardContent,
    Slider,
    Modal,
    Button,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import { useSwipeable } from 'react-swipeable';
import ImageButton from '../basic/ImageButton';
import { logEvent, logPageView } from '../../analytics';

import { userData } from '../../stores/UserDataStore';
import { observer } from 'mobx-react-lite';
import { usePremium } from '../../contexts/PremiumContext';
import { feedStore } from '../../stores/FeedStore';
import { dislikePerson, likePerson, superLikePerson } from '../../api/feed';
import { UserChat } from '../../api/chats';
import { SuperLikeResponse } from '../../types';


// Функция для создания стилей иконок
const iconStyles = (size: number, color: string) => ({
    fontSize: `${size}px`, // Установка размера шрифта
    color, // Установка цвета
});

// Определение иконок с использованием стилей
const icons = {
    close: <CloseIcon sx={iconStyles(30, "black")} />, // Иконка закрытия
    favorite: <FavoriteIcon sx={iconStyles(50, "red")} />, // Иконка лайка
    star: <StarIcon sx={iconStyles(30, "green")} />, // Иконка суперлайка
};

interface FeedProps {
    chats: UserChat[];
}

// Основной компонент SwipeableCard
const FeedPage: React.FC<FeedProps> = observer(({ chats }) => {
    const DURATION = 300; // Длительность анимации в миллисекундах
    const [swipeDirection, setSwipeDirection] = useState<string | null>(null); // Направление свайпа
    const [iconVisible, setIconVisible] = useState(false); // Видимость иконки

    const person = feedStore.getCurrentPerson();

    const { isPremium } = usePremium();
    const [isPremiumModalOpen, setPremiumModalOpen] = useState(false); // Состояние для премиум-сообщения
    const [isModalOpen, setModalOpen] = useState(false); // Состояние модального окна

    const initGender = userData.getGenderPreference();
    const [gender, setGender] = useState("");

    const initAge = feedStore.getAgePreference();
    const [age, setAge] = useState<number[]>(initAge || []);

    const initHeight = feedStore.getHeightPreference();
    const [height, setHeight] = useState<number[]>(initHeight || []);
    const [relationshipType, setRelationshipType] = useState<string[]>([]);

    // Эффект для получения следующего человека при монтировании компонента
    useEffect(() => {
        logPageView("/feed"); // GA log on page open
        feedStore.loadNewPerson(isPremium); // Передаем флаг в метод стора
    }, [isPremium]); // Зависимость от функции получения следующего человека

    // Обработчик свайпа
    const handleSwipe = (dir: string) => {
        if (!person) return; // Если вообще нет человека (например, notFound), то игнорируем

        if (dir === "up" && !isPremium) {
            setPremiumModalOpen(true);
            return;
        }
        setSwipeDirection(dir); // Установка направления свайпа
        setIconVisible(true); // Показ иконки в процессе свайпа

        const user_id = userData.getIsu(); // Он лайкает
        const target_id = person.isu; // Его лайкаем

        // Вызов соответствующей функции в зависимости от направления свайпа
        switch (dir) {
            case "left":
                dislikePerson(user_id, target_id)
                    .then(response => console.log('Dislike response:', response))
                    .catch(error => console.error('Dislike error:', error));
                logEvent("Feed", "User pressed/swiped dislike", "");
                break;
            case "right":
                likePerson(user_id, target_id)
                    .then(response => {
                        if (response.matched) {
                            chats.push({ chat_id: response.chat_id || "", isu_1: user_id, isu_2: target_id });
                        }
                        console.log('Like response:', response)
                    })
                    .catch(error => console.error('Like error:', error));
                logEvent("Feed", "User pressed/swiped like", "");
                break;
            case "up":
                superLikePerson(user_id, target_id)
                .then((response: SuperLikeResponse) => {
                    console.log('SuperLike person:', response);
                    chats.push({ chat_id: response.chat_id || "", isu_1: user_id, isu_2: target_id });
                })
                .catch(error => console.error('SuperLike error:', error));
                logEvent("Feed", "User pressed/swiped superlike", "");
                break;
        }

        // Сброс состояния после завершения свайпа
        setTimeout(async () => {
            setSwipeDirection(null); // Сброс направления свайпа
            await feedStore.loadNewPerson(isPremium); // Получение следующего человека
            setIconVisible(false); // Скрытие иконки
        }, DURATION); // Задержка по длительности анимации
    };

    // Настройка обработчиков свайпа с использованием библиотеки react-swipeable
    const handlers = useSwipeable({
        onSwipedLeft: () => handleSwipe('left'), // Обработка свайпа влево
        onSwipedRight: () => handleSwipe('right'), // Обработка свайпа вправо
        onSwipedUp: () => handleSwipe('up'), // Обработка свайпа вверх
    });

    const updateGender = (newGender: string) => {
        if (newGender === null) {
            return;
        }
        setGender(newGender)
        userData.setGenderPreference(newGender);
    }

    const updateAge = (newAge: number[]) => {
        setAge(newAge)
        feedStore.setAgePreference(newAge);
    }

    const updateHeight = (newHeight: number[]) => {
        setHeight(newHeight)
        feedStore.setHeightPreference(newHeight);
    }

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    const handlePremiumModalOpen = () => setPremiumModalOpen(true);
    const handlePremiumModalClose = () => setPremiumModalOpen(false);


    return (
        <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', background: "white" }}>
                    <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{
                            color: '#4a4a4a', // Тёмно-серый цвет заголовка
                            fontFamily: "'Poppins', Arial, sans-serif",
                            fontWeight: 600,
                        }}
                    >
                        Поиск
                    </Typography>
                    {/* Заголовок приложения */}
                    {/* Кнопка для открытия модального окна */}
                    <Button
                        variant="contained"
                        onClick={openModal}
                        sx={{
                            borderRadius: '30px',
                            textTransform: 'none',
                            backgroundColor: '#4469a6', // Синий цвет кнопки
                            fontSize: '16px', // Размер текста кнопки
                            fontWeight: 'bold', // Жирный текст
                            padding: '10px 20px', // Пространство внутри кнопки
                            color: 'white',
                            '&:hover': { backgroundColor: '#283e61' }, // Более тёмный оттенок на hover
                        }}
                    >
                        Фильтры
                    </Button>

                </Toolbar>
            </AppBar>

            {/* Основная область для отображения карточки с человеком */}
            {feedStore.loading || userData.loading ? (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <CircularProgress /> {/* Show a loading spinner while data is being fetched */}
                </Box>
            ) : feedStore.notFound ? (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Typography variant="h6">
                        К сожалению, никого не нашли под данные фильтры.
                    </Typography>
                </Box>
            ) : !person ? (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Typography variant="h6">Произошла ошибка при получении профиля, попробуйте позже.</Typography>
                </Box>
            ) : (
                <>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }} {...handlers}>
                        <Card sx={{
                            width: "80%", // Ширина карточки
                            height: "80%", // Высота карточки
                            borderRadius: '16px',
                            transform: swipeDirection === 'left' ? 'rotateZ(-20deg)' : swipeDirection === 'right' ? 'rotateZ(20deg)' : swipeDirection === 'up' ? 'translate(0, -200px)' : "none", // Применение трансформации в зависимости от направления свайпа
                            transition: swipeDirection === null ? 'none' : `transform ${DURATION / 1000}s`, // Плавный переход
                            transformOrigin: "bottom center", // Точка поворота для трансформации
                            position: 'absolute', // Позиционирование карточки
                            display: 'flex', // Flexbox для внутреннего содержимого карточки
                            flexDirection: "column", // Вертикальная ориентация
                            justifyContent: "space-between", // Распределение пространства между элементами
                        }}>
                            <CardMedia component="img" image={person.logo || '/images/placeholder.png'} alt={person.username}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: '#fff',
                                    objectFit: 'contain',
                                }}
                            /> {/* Изображение человека */}
                            {iconVisible && (
                                <Box sx={{
                                    position: 'absolute',
                                    top: '50%', // Центрирование по вертикали
                                    left: '50%', // Центрирование по горизонтали
                                    transform: 'translate(-50%, -50%)', // Сдвиг для центрирования
                                    zIndex: 10, // Установка z-индекса для отображения над карточкой
                                }}>
                                    <ImageButton radius="100px">
                                        {icons[swipeDirection === 'left' ? 'close' : swipeDirection === 'right' ? 'favorite' : 'star']} {/* Отображение соответствующей иконки в зависимости от направления свайпа */}
                                    </ImageButton>
                                </Box>
                            )}
                            <CardContent>
                                <Typography variant="h5">{person.username}</Typography> {/* Имя человека */}
                                <Typography variant="body2">{person.bio}</Typography> {/* Описание человека */}
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Кнопки для управления свайпами */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', padding: 4 }}>
                        <ImageButton onClick={() => handleSwipe("left")} radius='70px'>{icons.close}</ImageButton> {/* Кнопка "не понравилось" */}
                        <ImageButton onClick={() => handleSwipe("right")} radius='100px'>{icons.favorite}</ImageButton> {/* Кнопка лайка */}
                        <ImageButton onClick={() => handleSwipe("up")} radius='70px'>{icons.star}</ImageButton> {/* Кнопка суперлайка */}
                    </Box>
                </>
            )}

            {/* Модальное окно */}
            <Modal open={isModalOpen} onClose={closeModal}>
                <Paper
                    sx={{
                        width: '90%',
                        maxWidth: '400px',
                        margin: '10% auto',
                        p: 3,
                        borderRadius: 3,
                        outline: 'none',
                        boxShadow: 24,
                        maxHeight: '80vh',
                        overflowY: 'auto',
                    }}
                >
                    {/* Заголовок и кнопка закрытия */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight="bold">Фильтры</Typography>
                        <IconButton onClick={closeModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Пол */}
                    <Typography>Пол</Typography>
                    <ToggleButtonGroup
                        value={gender ? gender : initGender}
                        exclusive
                        onChange={(e, value) => updateGender(value)}
                        fullWidth
                        sx={{ mb: 3 }}
                    >
                        <ToggleButton value="Male">Мужчины</ToggleButton>
                        <ToggleButton value="Female">Женщины</ToggleButton>
                        <ToggleButton value="Everyone">Неважно</ToggleButton>
                    </ToggleButtonGroup>

                    {/* Возраст */}
                    <Typography>Возраст: {age[0]} - {age[1]}</Typography>
                    <Slider
                        value={age ? age : initAge}
                        onChange={(e, value) => updateAge(value as number[])}
                        valueLabelDisplay="auto"
                        min={18}
                        max={60}
                        sx={{ mb: 3 }}
                    />

                    {/* Премиум-фильтры */}
                    <Box>
                        <Typography>Рост{isPremium ? `: ${height[0]} - ${height[1]}` : " (доступно по подписке)"}</Typography>
                        <Slider
                            disabled={!isPremium}
                            value={height ? height : initHeight}
                            valueLabelDisplay="auto"
                            min={150}
                            max={220}
                            onChange={(e, value) => updateHeight(value as number[])}
                            sx={{ mb: 3 }}
                        />

                        <Typography>Тип отношений {isPremium ? "" : "(доступно по подписке)"}</Typography>
                        <ToggleButtonGroup
                            disabled={!isPremium}
                            value={relationshipType}
                            onClick={isPremium ? () => { } : handlePremiumModalOpen} // Открытие премиум-сообщения
                            onChange={(e, value) => {
                                setRelationshipType(value);
                                feedStore.setRelationshipPreference(value);
                            }}
                            fullWidth
                        >
                            <ToggleButton value="672b44eab151637e969889bb">Свидания</ToggleButton>
                            <ToggleButton value="672b44eab151637e969889bc">Отношения</ToggleButton>
                            <ToggleButton value="672b44eab151637e969889bd">Дружба</ToggleButton>
                            <ToggleButton value="672b44eab151637e969889be">Общение</ToggleButton>
                        </ToggleButtonGroup>

                    </Box>

                    {/* Кнопка подтверждения */}
                    <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={() => {
                        closeModal();
                        feedStore.loadNewPerson(isPremium);
                    }}>
                        Применить
                    </Button>
                </Paper>
            </Modal>

            {/* Выплывающее окошко для премиум-сообщения */}
            <Modal open={isPremiumModalOpen} onClose={handlePremiumModalClose}>
                <Paper
                    sx={{
                        width: '80%',
                        maxWidth: '350px',
                        margin: '20% auto',
                        p: 3,
                        borderRadius: 2,
                        boxShadow: 24,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Доступно по подписке
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Активация этого фильтра доступна только по подписке. Вы можете оформить её в профиле.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handlePremiumModalClose}
                        sx={{ textTransform: 'none' }}
                    >
                        Закрыть
                    </Button>
                </Paper>
            </Modal>
        </Box>
    );
});

export default FeedPage; // Экспорт компонента SwipeableCard