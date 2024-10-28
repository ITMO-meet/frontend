import React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Nav: React.FC = () => {
    const [value, setValue] = React.useState(0);

    return (
        <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            showLabels
        >
            <BottomNavigationAction label="Chats" icon={<ChatIcon />} />
            <BottomNavigationAction label="Likes" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Search" icon={<SearchIcon />} />
            <BottomNavigationAction label="Matches" icon={<PeopleIcon />} />
            <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} />
        </BottomNavigation>
    );
};

export default Nav;
