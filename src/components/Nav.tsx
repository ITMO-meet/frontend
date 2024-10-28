import React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Nav: React.FC = () => {
    const [value, setValue] = React.useState('search');

    return (
        <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            showLabels
        >
            <BottomNavigationAction label="Chats" value="chats" icon={<ChatIcon />} />
            <BottomNavigationAction label="Likes" value="likes" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Search" value="search" icon={<SearchIcon />} />
            <BottomNavigationAction label="Matches" value="matches" icon={<PeopleIcon />} />
            <BottomNavigationAction label="Profile" value="profile" icon={<AccountCircleIcon />} />
        </BottomNavigation>
    );
};

export default Nav;
