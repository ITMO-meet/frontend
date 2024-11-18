import React, { useState } from 'react';
import { Box, Typography, IconButton, Paper, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import StraightenIcon from '@mui/icons-material/Straighten';
import ChurchIcon from '@mui/icons-material/Church';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BookIcon from '@mui/icons-material/Book';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CelebrationIcon from '@mui/icons-material/Celebration';

const matches = [
    {
        id: 1,
        name: 'Test user1',
        avatar: 'https://randomwordgenerator.com/img/picture-generator/54e7d7404853a914f1dc8460962e33791c3ad6e04e507440752972d29e4bc3_640.jpg',
        photos: [
            'https://randomwordgenerator.com/img/picture-generator/54e7d7404853a914f1dc8460962e33791c3ad6e04e507440752972d29e4bc3_640.jpg',
            'https://randomwordgenerator.com/img/picture-generator/54e2d34b4a52aa14f1dc8460962e33791c3ad6e04e507749742c78d59e45cc_640.jpg',
            'https://randomwordgenerator.com/img/picture-generator/57e9dc434b5ba414f1dc8460962e33791c3ad6e04e50744172297bd5934cc4_640.jpg',
        ],
        mainFeatures: [
            { text: '170 cm', icon: <StraightenIcon /> },
            { text: 'Atheism', icon: <ChurchIcon /> },
            { text: 'Aries', icon: <Typography sx={{ fontSize: 20 }}>♈️</Typography> },
            { text: 'No but would like', icon: <ChildCareIcon /> },
            { text: 'Neutral', icon: <LocalBarIcon /> },
            { text: 'Neutral', icon: <SmokingRoomsIcon /> },
        ],
        interests: [
            { text: 'Music', icon: <MusicNoteIcon /> },
            { text: 'GYM', icon: <FitnessCenterIcon /> },
            { text: 'Reading', icon: <BookIcon /> },
            { text: 'Cooking', icon: <RestaurantIcon /> },
            { text: 'Raves', icon: <CelebrationIcon /> },
        ],
    },
    {
        id: 2,
        name: 'Test user2',
        avatar: 'https://randomwordgenerator.com/img/picture-generator/53e9d7444b50b10ff3d8992cc12c30771037dbf852547849752678d5964e_640.jpg',
        photos: [
            'https://randomwordgenerator.com/img/picture-generator/53e9d7444b50b10ff3d8992cc12c30771037dbf852547849752678d5964e_640.jpg',
            'https://randomwordgenerator.com/img/picture-generator/52e9d2474854a514f1dc8460962e33791c3ad6e04e50744172297cdd944fc2_640.jpg',
        ],
        mainFeatures: [
            { text: '165 cm', icon: <StraightenIcon /> },
            { text: 'Catholicism', icon: <ChurchIcon /> },
            { text: 'Libra', icon: <Typography sx={{ fontSize: 20 }}>♎</Typography> },
            { text: 'Already have', icon: <ChildCareIcon /> },
            { text: 'Positive', icon: <LocalBarIcon /> },
            { text: 'Negative', icon: <SmokingRoomsIcon /> },
        ],
        interests: [
            { text: 'Traveling', icon: <MusicNoteIcon /> },
            { text: 'Painting', icon: <FitnessCenterIcon /> },
        ],
    },
];

const MatchesPage: React.FC = () => {
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isListVisible, setIsListVisible] = useState(false);

    const currentMatch = matches[currentMatchIndex];

    const handleNextMatch = () => {
        setCurrentMatchIndex((prevIndex) => (prevIndex + 1) % matches.length);
        setCurrentPhotoIndex(0);
    };

    const handlePrevMatch = () => {
        setCurrentMatchIndex((prevIndex) => (prevIndex - 1 + matches.length) % matches.length);
        setCurrentPhotoIndex(0);
    };

    const handleNextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % currentMatch.photos.length);
    };

    const handlePrevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + currentMatch.photos.length) % currentMatch.photos.length);
    };

    const handleSelectMatch = (index: number) => {
        setCurrentMatchIndex(index);
        setCurrentPhotoIndex(0);
        setIsListVisible(false);
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" p={2}>
            {/* Header */}
            <Box display="flex" alignItems="center" mb={2}>
                <IconButton aria-label="Open match list" onClick={() => setIsListVisible(true)} sx={{ mr: 2 }}>
                    <ListIcon />
                </IconButton>
            </Box>

            {/* Список метчей */}
            {isListVisible && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    bgcolor="rgba(0, 0, 0, 0.5)"
                    zIndex={10}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Paper sx={{ width: '80%', maxHeight: '80%', overflowY: 'auto', borderRadius: '12px', p: 4 }}>
                        {/* Header */}
                        <Box position="relative" display="flex" alignItems="center" justifyContent="center" mb={2}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    position: 'absolute',
                                }}
                            >
                                Match list
                            </Typography>

                            <IconButton
                                aria-label="Close match list"
                                onClick={() => setIsListVisible(false)}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    right: 0,
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        {/* Список */}
                        <List>
                            {matches.map((match, index) => (
                                <React.Fragment key={match.id}>
                                    <ListItem
                                        component="button"
                                        onClick={() => handleSelectMatch(index)}
                                        sx={{
                                            textAlign: 'left',
                                            width: '100%',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                src={match.avatar}
                                                alt={match.name}
                                                sx={{ width: 48, height: 48 }}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText primary={match.name} />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Box>
            )}

            {/* Username */}
            <Box display="flex" minHeight="10px">
                <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', flexGrow: 1 }}>
                    {currentMatch.name}
                </Typography>
            </Box>

            {/* Фотографии */}
            <Box mb={2} sx={{ position: 'relative', textAlign: 'center' }}>
                <IconButton
                    aria-label="Previous Photo"
                    onClick={handlePrevPhoto}
                    sx={{
                        position: 'absolute',
                        left: '-40px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        padding: '50px',
                        backgroundColor: 'transparent',
                    }}
                >
                    <ArrowBackIosIcon />
                </IconButton>

                <Box
                    component="img"
                    src={currentMatch.photos[currentPhotoIndex]}
                    alt={`${currentMatch.name} photo ${currentPhotoIndex + 1}`}
                    sx={{
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: '12px',
                    }}
                />

                <IconButton
                    aria-label="Next Photo"
                    onClick={handleNextPhoto}
                    sx={{
                        position: 'absolute',
                        right: '-40px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        padding: '50px',
                        backgroundColor: 'transparent',
                    }}
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>

            {/* Фичи и интересы */}
            <Paper
                sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: '#f5f5f5',
                    borderRadius: '12px',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Main Features
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    {currentMatch.mainFeatures.map((feature, index) => (
                        <Box
                            key={index}
                            display="flex"
                            alignItems="center"
                            sx={{
                                bgcolor: 'rgba(214, 231, 255, 0.8)',
                                border: '1px solid rgba(214, 231, 255, 0.8)',
                                borderRadius: '8px',
                                padding: '4px 8px',
                                gap: '4px',
                            }}
                        >
                            {feature.icon}
                            <Typography>{feature.text}</Typography>
                        </Box>
                    ))}
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Interests
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                    {currentMatch.interests.map((interest, index) => (
                        <Box
                            key={index}
                            display="flex"
                            alignItems="center"
                            sx={{
                                bgcolor: 'rgba(214, 231, 255, 0.8)',
                                border: '1px solid rgba(214, 231, 255, 0.8)',
                                borderRadius: '8px',
                                padding: '4px 8px',
                                gap: '4px',
                            }}
                        >
                            {interest.icon}
                            <Typography>{interest.text}</Typography>
                        </Box>
                    ))}
                </Box>
            </Paper>

            {/* Навигация */}
            <Box display="flex" justifyContent="space-between" mt="auto">
                <IconButton aria-label="Previous match" onClick={handlePrevMatch}>
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography>
                    Match {currentMatchIndex + 1} of {matches.length}
                </Typography>
                <IconButton aria-label="Next match" onClick={handleNextMatch}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default MatchesPage;
