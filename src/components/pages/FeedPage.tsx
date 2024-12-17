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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import { useSwipeable } from 'react-swipeable';
import ImageButton from '../basic/ImageButton';
import { logEvent, logPageView } from '../../analytics';

// Интерфейс для представления информации о человеке
interface Person {
    isu: number; // Уникальный идентификатор
    logo: string; // Ссылка на изображение
    username: string; // Имя человека
    bio: string; // Описание человека
}

// Интерфейс для свойств компонента SwipeableCard
interface Props {
    getNextPerson: () => Person; // Функция для получения информации о следующем человеке
    onLike: (person: Person) => void; // Функция для лайков
    onSuperLike: (person: Person) => void; // Функция для суперлайков
    onDislike: (person: Person) => void; // Функция для "не понравилось"
}

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

// Основной компонент SwipeableCard
export const FeedPage: React.FC<Props> = ({ getNextPerson, onLike, onDislike, onSuperLike }) => {
    const DURATION = 300; // Длительность анимации в миллисекундах
    const [swipeDirection, setSwipeDirection] = useState<string | null>(null); // Направление свайпа
    const [iconVisible, setIconVisible] = useState(false); // Видимость иконки
    const [person, setPerson] = useState<Person>({ isu: 0, username: "", bio: "", logo: "" }); // Текущий человек

    const [] = useState(false); // Открытие/закрытие Drawer
   
    // Эффект для получения следующего человека при монтировании компонента
    useEffect(() => {
        logPageView("/feed"); // GA log on page open
        setPerson(getNextPerson()); // Установка следующего человека
    }, []); // Зависимость от функции получения следующего человека

    // Обработчик свайпа
    const handleSwipe = (dir: string) => {
        setSwipeDirection(dir); // Установка направления свайпа
        setIconVisible(true); // Показ иконки в процессе свайпа

        // Вызов соответствующей функции в зависимости от направления свайпа
        switch (dir) {
            case "left":
                onDislike(person); // Если свайп влево, вызвать функцию "не понравилось"
                logEvent("Feed", "User pressed/swiped dislike", "");
                break;
            case "right":
                onLike(person); // Если свайп вправо, вызвать функцию лайка
                logEvent("Feed", "User pressed/swiped like", "");
                break;
            case "up":
                onSuperLike(person); // Если свайп вверх, вызвать функцию суперлайка
                logEvent("Feed", "User pressed/swiped superlike", "");
                break;
        }

        // Сброс состояния после завершения свайпа
        setTimeout(() => {
            setSwipeDirection(null); // Сброс направления свайпа
            setPerson(getNextPerson()); // Получение следующего человека
            setIconVisible(false); // Скрытие иконки
        }, DURATION); // Задержка по длительности анимации
    };

    // Настройка обработчиков свайпа с использованием библиотеки react-swipeable
    const handlers = useSwipeable({
        onSwipedLeft: () => handleSwipe('left'), // Обработка свайпа влево
        onSwipedRight: () => handleSwipe('right'), // Обработка свайпа вправо
        onSwipedUp: () => handleSwipe('up'), // Обработка свайпа вверх
    });

    const [isModalOpen, setModalOpen] = useState(false); // Состояние модального окна
    const [gender, setGender] = useState<string>('Мужчины');
    const [isPremiumModalOpen, setPremiumModalOpen] = useState(false); // Состояние для премиум-сообщения
    const [age, setAge] = useState<number[]>([18, 60]);
    const [relationshipType] = useState<string[]>([]);
    
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    const handlePremiumModalOpen = () => setPremiumModalOpen(true);
    const handlePremiumModalClose = () => setPremiumModalOpen(false);

    return (
        <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', background: "white" }}>
                    <Typography color="primary" fontSize="36px">Search</Typography> {/* Заголовок приложения */}
                        {/* Кнопка для открытия модального окна */}
                        <Button
                            variant="contained"
                            onClick={openModal}
                            sx={{
                                borderRadius: '50px',
                                textTransform: 'none',
                                backgroundColor: '#4469a6', // Голубой цвет (MUI Blue 500)
                                color: 'white',
                                '&:hover': { backgroundColor: '#283e61' }, // Более тёмный оттенок голубого при наведении
                            }}
                        >
                            Фильтры
                        </Button>
                </Toolbar>
            </AppBar>

            {/* Основная область для отображения карточки с человеком */}
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
                    <CardMedia component="img" image={person.logo} alt={person.username} /> {/* Изображение человека */}
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
                    value={gender}
                    exclusive
                    onChange={(e, value) => setGender(value || gender)}
                    fullWidth
                    sx={{ mb: 3 }}
                >
                    <ToggleButton value="Мужчины">Мужчины</ToggleButton>
                    <ToggleButton value="Женщины">Женщины</ToggleButton>
                    <ToggleButton value="Неважно">Неважно</ToggleButton>
                </ToggleButtonGroup>

                {/* Возраст */}
                <Typography>Возраст: {age[0]} - {age[1]}</Typography>
                <Slider
                    value={age}
                    onChange={(e, value) => setAge(value as number[])}
                    valueLabelDisplay="auto"
                    min={18}
                    max={60}
                    sx={{ mb: 3 }}
                />

                {/* Премиум-фильтры */}
                <Box>
                    <Typography>Рост (доступно по подписке)</Typography>
                    <Slider
                        disabled
                        value={[150, 200]}
                        valueLabelDisplay="auto"
                        min={150}
                        max={220}
                        onClick={handlePremiumModalOpen} // Открытие премиум-сообщения
                        sx={{ mb: 3 }}
                    />

                    <Typography>Тип отношений (доступно по подписке)</Typography>
                    <ToggleButtonGroup
                        disabled
                        value={relationshipType}
                        onClick={handlePremiumModalOpen} // Открытие премиум-сообщения
                        fullWidth
                    >
                        <ToggleButton value="Свидания">Свидания</ToggleButton>
                        <ToggleButton value="Отношения">Отношения</ToggleButton>
                        <ToggleButton value="Дружба">Дружба</ToggleButton>
                        <ToggleButton value="Общение">Общение</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* Кнопка подтверждения */}
                <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={closeModal}>
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
};

export default FeedPage; // Экспорт компонента SwipeableCard