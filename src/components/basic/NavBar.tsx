/**
 * Компонент NavBar представляет собой нижнюю панель навигации с пятью основными разделами:
 * - Chats: Переход к странице чатов
 * - Matches: Переход к странице тех кто тебя лайкнул
 * - Search: Переход к странице с лентой поиска
 * - Tests: Переход к странице тестов
 * - Profile: Переход к странице профиля
 * 
 * Компонент использует библиотеку React Router для управления маршрутизацией. 
 * Текущее активное значение в навигации устанавливается на основе текущего пути.
 * 
 * Функция handleNavigationChange обновляет состояние и значение активного раздела навигации,
 * что вызывает перенаправление на соответствующую страницу.
 * 
 * Основные зависимости:
 * - useNavigate и useLocation из React Router для работы с навигацией.
 * - BottomNavigation и BottomNavigationAction из MUI для создания интерфейса навигации.
 */

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Инициализируем значение на основе текущего пути
    const [value, setValue] = React.useState(location.pathname.substring(1) || 'search');

    // Обновляем маршрут при изменении значения value
    useEffect(() => {
        if (value) {
            navigate(`/${value}`);
        }
    }, [value, navigate]);

    // Обработчик изменения раздела навигации
    const handleNavigationChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <BottomNavigation
            value={value}
            onChange={handleNavigationChange}
            showLabels
        >
            <BottomNavigationAction label="Chats" value="chats" icon={<ChatIcon />} />
            <BottomNavigationAction label="Matches" value="matches" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Feed" value="feed" icon={<SearchIcon />} />
            <BottomNavigationAction label="Tests" value="tests" icon={<FormatListBulletedIcon />} />
            <BottomNavigationAction label="Profile" value="profile" icon={<AccountCircleIcon />} />
        </BottomNavigation>
    );
};

export default NavBar;
