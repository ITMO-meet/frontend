import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Card,
    CardMedia,
    CardContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSwipeable } from 'react-swipeable';
import ImageButton from '../basic/ImageButton';

const iconStyles = (size: number, color: string) => ({
    fontSize: `${size}px`,
    color,
});

const icons = {
    close: <CloseIcon sx={iconStyles(30, "black")} />,
    favorite: <FavoriteIcon sx={iconStyles(50, "red")} />,
    star: <StarIcon sx={iconStyles(30, "green")} />,
};

const people = [
    {
        name: 'Jane Smith1',
        description: 'Product Designer',
        image: 'https://steamuserimages-a.akamaihd.net/ugc/1844789643806854188/FB581EAD503907F56A009F85371F6FB09A467FEC/?imw=512&imh=497&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',
    },
    {
        name: 'Jane Smith2',
        description: 'Product Designer',
        image: 'https://i.pinimg.com/736x/56/21/7b/56217b1ef6a69a2583ff13655d48bc53.jpg',
    },
    {
        name: 'Jane Smith3',
        description: 'Product Designer',
        image: 'https://avatars.yandex.net/get-music-content/5878680/7bee58da.a.25445174-1/m1000x1000?webp=false',
    },
];

export const SwipeableCard: React.FC = () => {
    const DURATION = 300;
    const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [iconVisible, setIconVisible] = useState(false);

    const handleSwipe = (dir: string) => {
        setSwipeDirection(dir);
        setIconVisible(true);

        setTimeout(() => {
            setSwipeDirection(null);
            setCurrentIndex((prev) => (prev + 1) % people.length);
            setIconVisible(false);
        }, DURATION);
    };

    const handlers = useSwipeable({
        onSwipedLeft: () => handleSwipe('left'),
        onSwipedRight: () => handleSwipe('right'),
        onSwipedUp: () => handleSwipe('up'),
    });

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography fontSize="36px">Search</Typography>
                    <IconButton edge="end" color="inherit">
                        <MoreVertIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }} {...handlers}>
                <Card sx={{
                    width: "80%",
                    height: "80%",
                    transform: swipeDirection === 'left' ? 'rotateZ(-20deg)' : swipeDirection === 'right' ? 'rotateZ(20deg)' : swipeDirection === 'up' ? 'translate(0, -200px)' : "none",
                    transition: swipeDirection === null ? 'none' : `transform ${DURATION / 1000}s`,
                    transformOrigin: "bottom center",
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}>
                    <CardMedia component="img" image={people[currentIndex].image} alt={people[currentIndex].name} />
                    {iconVisible && (
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 10,
                        }}>
                            <ImageButton radius="100px">
                                {icons[swipeDirection === 'left' ? 'close' : swipeDirection === 'right' ? 'favorite' : 'star']}
                            </ImageButton>
                        </Box>
                    )}
                    <CardContent>
                        <Typography variant="h5">{people[currentIndex].name}</Typography>
                        <Typography variant="body2">{people[currentIndex].description}</Typography>
                    </CardContent>
                </Card>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-around', padding: 4 }}>
                <ImageButton onClick={() => handleSwipe("left")} radius='70px'>{icons.close}</ImageButton>
                <ImageButton onClick={() => handleSwipe("right")} radius='100px'>{icons.favorite}</ImageButton>
                <ImageButton onClick={() => handleSwipe("up")} radius='70px'>{icons.star}</ImageButton>
            </Box>
        </Box>
    );
};

export default SwipeableCard;