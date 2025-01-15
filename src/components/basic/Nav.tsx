import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLocation, useNavigate } from 'react-router-dom';

const Nav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentValue = () => {
    if (location.pathname.startsWith('/matches')) return 'matches';
    if (location.pathname.startsWith('/feed')) return 'feed';
    if (location.pathname.startsWith('/tests')) return 'tests';
    if (location.pathname.startsWith('/profile')) return 'profile';
    if (location.pathname.startsWith('/chats')) return 'chats';
  };

  const [value, setValue] = React.useState(getCurrentValue());

  React.useEffect(() => {
    setValue(getCurrentValue());
  }, [location]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(`/${newValue}`);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      showLabels
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: '#f5f5f5', // Светлый фон
        boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.15)',
      }}
    >
      <BottomNavigationAction
        label="Чаты"
        value="chats"
        icon={<ChatIcon />}
        sx={{
          '&.Mui-selected': {
            color: '#4d60bf', // Цвет для выбранного элемента
          },
        }}
      />
      <BottomNavigationAction
        label="Мэтчи"
        value="matches"
        icon={<FavoriteIcon />}
        sx={{
          '&.Mui-selected': {
            color: '#4d60bf', // Цвет для выбранного элемента
          },
        }}
      />
      <BottomNavigationAction
        label="Лента"
        value="feed"
        icon={<SearchIcon />}
        sx={{
          '&.Mui-selected': {
            color: '#4d60bf', // Цвет для выбранного элемента
          },
        }}
      />
      <BottomNavigationAction
        label="Тесты"
        value="tests"
        icon={<FormatListBulletedIcon />}
        sx={{
          '&.Mui-selected': {
            color: '#4d60bf', // Цвет для выбранного элемента
          },
        }}
      />
      <BottomNavigationAction
        label="Профиль"
        value="profile"
        icon={<AccountCircleIcon />}
        sx={{
          '&.Mui-selected': {
            color: '#4d60bf', // Цвет для выбранного элемента
          },
        }}
      />
    </BottomNavigation>
  );
};

export default Nav;
