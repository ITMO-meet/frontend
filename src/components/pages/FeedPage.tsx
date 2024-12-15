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
    Drawer,
    Slider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSwipeable } from 'react-swipeable';
import ImageButton from '../basic/ImageButton';
import RoundButton from '../basic/RoundButton';
import theme from '../theme';
import HorizontalButtonGroup from '../basic/HorizontalButtonGroup';
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

    const [drawerOpen, setDrawerOpen] = useState(false); // Открытие/закрытие Drawer
    const [distance, setDistance] = useState<number>(100); // Дистанция до 100
    const [age, setAge] = useState<number[]>([18, 60]); // Возраст от 18 до 60

    // Эффект для получения следующего человека при монтировании компонента
    useEffect(() => {
        logPageView("/feed"); // GA log on page open
        setPerson(getNextPerson()); // Установка следующего человека
    }, []); // Зависимость от функции получения следующего человека

    // Функция для переключения состояния Drawer
    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
    };

    // Обработчик изменения дистанции
    const handleDistanceChange = (event: Event, newValue: number | number[]) => {
        setDistance(newValue as number); // Установка новой дистанции
    };

    // Обработчик изменения возраста
    const handleAgeChange = (event: Event, newValue: number | number[]) => {
        setAge(newValue as number[]); // Установка нового возраста
    };

    // Обработчик свайпа
    const handleSwipe = (dir: string) => {
        setSwipeDirection(dir); // Установка направления свайпа
        setIconVisible(true); // Показ иконки в процессе свайпа

        // Вызов соответствующей функции в зависимости от направления свайпа
        switch (dir) {
            case "left":
                onDislike(person); // Если свайп влево, вызвать функцию "не понравилось"
                logEvent("Feed", "User pressed/swiped dislike","");
                break;
            case "right":
                onLike(person); // Если свайп вправо, вызвать функцию лайка
                logEvent("Feed", "User pressed/swiped like","");
                break;
            case "up":
                onSuperLike(person); // Если свайп вверх, вызвать функцию суперлайка
                logEvent("Feed", "User pressed/swiped superlike","");
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

    return (
        <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', background: "white" }}>
                    <Typography color="primary" fontSize="36px">Search</Typography> {/* Заголовок приложения */}
                    <IconButton edge="end" color="inherit" onClick={toggleDrawer(true)}>
                        <MoreVertIcon color='primary' /> {/* Кнопка для открытия Drawer */}
                    </IconButton>
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

            {/* Drawer для фильтров */}
            <Drawer
                anchor="bottom" // Позиционирование Drawer снизу
                open={drawerOpen} // Открытие или закрытие Drawer
                onClose={toggleDrawer(false)} // Обработчик закрытия
                sx={{
                    '& .MuiDrawer-paper': {
                        borderTopLeftRadius: 16, // Закругление верхнего левого угла
                        borderTopRightRadius: 16, // Закругление верхнего правого угла
                        backgroundColor: theme.palette.secondary.light, // Установка фона Drawer
                    },
                }}
            >
                <Box sx={{ padding: 2, width: '100%' }}>
                    <IconButton onClick={toggleDrawer(false)} sx={{ position: 'absolute', top: 10, right: 10 }}>
                        <CloseIcon /> {/* Кнопка закрытия Drawer */}
                    </IconButton>
                    <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center' }}>
                        Filters {/* Заголовок секции фильтров */}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                        Interested in {/* Подзаголовок для выбора интересов */}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <HorizontalButtonGroup options={["Man", "Woman", "Helicopters"]} spacing={10} onButtonClick={console.log} /> {/* Группа кнопок для выбора интересов */}
                    </Box>
                    <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                        Distance {distance} {/* Отображение текущей дистанции */}
                    </Typography>
                    <Slider
                        value={distance} // Установка значения для слайдера
                        onChange={handleDistanceChange} // Обработчик изменения значения
                        valueLabelDisplay="off" // Отключение отображения метки значения
                        min={0} // Минимальное значение
                        max={100} // Максимальное значение
                    />

                    <Typography variant="subtitle1" sx={{ margin: '16px 0 1px' }}>
                        Age {age[0]} - {age[1]} {/* Отображение диапазона возраста */}
                    </Typography>
                    <Slider
                        value={age} // Установка значения для слайдера возраста
                        onChange={handleAgeChange} // Обработчик изменения возраста
                        valueLabelDisplay="off" // Отключение отображения метки значения
                        min={18} // Минимальное значение возраста
                        max={60} // Максимальное значение возраста
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <RoundButton onClick={toggleDrawer(false)}>Continue</RoundButton> {/* Кнопка продолжения */}
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
};

export default FeedPage; // Экспорт компонента SwipeableCard