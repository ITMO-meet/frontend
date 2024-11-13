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
      sx={{ position: 'fixed', bottom: 0, width: '100%' }}
    >
      <BottomNavigationAction label="Chats" value="chats" icon={<ChatIcon />} />
      <BottomNavigationAction label="Matches" value="matches" icon={<FavoriteIcon />} />
      <BottomNavigationAction label="Feed" value="feed" icon={<SearchIcon />} />
      <BottomNavigationAction label="Tests" value="tests" icon={<FormatListBulletedIcon />} />
      <BottomNavigationAction label="Profile" value="profile" icon={<AccountCircleIcon />} />
    </BottomNavigation>
  );
};

export default Nav;
