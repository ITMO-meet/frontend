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
    const [value, setValue] = React.useState(location.pathname.substring(1) || 'feed');

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
            sx={{
                backgroundColor: '#fff', // Белый фон
                boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.1)', // Тень
            }}
        >
            <BottomNavigationAction
                label="Chats"
                value="chats"
                icon={<ChatIcon />}
                sx={{
                    color: value === 'chats' ? '#4d60bf' : 'gray', // Цвет текста и иконки
                    '&.Mui-selected': {
                        color: '#4d60bf', // Цвет при выборе
                    },
                }}
            />
            <BottomNavigationAction
                label="Matches"
                value="matches"
                icon={<FavoriteIcon />}
                sx={{
                    color: value === 'matches' ? '#4d60bf' : 'gray',
                    '&.Mui-selected': {
                        color: '#4d60bf',
                    },
                }}
            />
            <BottomNavigationAction
                label="Feed"
                value="feed"
                icon={<SearchIcon />}
                sx={{
                    color: value === 'feed' ? '#4d60bf' : 'gray',
                    '&.Mui-selected': {
                        color: '#4d60bf',
                    },
                }}
            />
            <BottomNavigationAction
                label="Tests"
                value="tests"
                icon={<FormatListBulletedIcon />}
                sx={{
                    color: value === 'tests' ? '#4d60bf' : 'gray',
                    '&.Mui-selected': {
                        color: '#4d60bf',
                    },
                }}
            />
            <BottomNavigationAction
                label="Profile"
                value="profile"
                icon={<AccountCircleIcon />}
                sx={{
                    color: value === 'profile' ? '#4d60bf' : 'gray',
                    '&.Mui-selected': {
                        color: '#4d60bf',
                    },
                }}
            />
        </BottomNavigation>
    );
};

export default NavBar;
