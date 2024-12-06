import React, { useState } from 'react';
import { Box, Typography, IconButton, Paper, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, Button } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { usePremium } from '../../contexts/PremiumContext';
import { useNavigate } from 'react-router-dom';

interface MatchesPageProps {
    people: Array<{
        id: number;
        name: string;
        imageUrl: string;
        photos: string[];
        mainFeatures: { text: string; icon: JSX.Element }[];
        interests: { text: string; icon: JSX.Element }[];
    }>;
}

const MatchesPage: React.FC<MatchesPageProps> = ({ people }) => {
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isListVisible, setIsListVisible] = useState(false);

    const { isPremium } = usePremium();
    const navigate = useNavigate();

    const currentMatch = people[currentMatchIndex];
    const allPhotos = [currentMatch.imageUrl, ...currentMatch.photos];

    const handleNextMatch = () => {
        setCurrentMatchIndex((prevIndex) => (prevIndex + 1) % people.length);
        setCurrentPhotoIndex(0);
    };

    const handlePrevMatch = () => {
        setCurrentMatchIndex((prevIndex) => (prevIndex - 1 + people.length) % people.length);
        setCurrentPhotoIndex(0);
    };

    const handleNextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % allPhotos.length);
    };

    const handlePrevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + allPhotos.length) % allPhotos.length);
    };

    const handleSelectMatch = (index: number) => {
        setCurrentMatchIndex(index);
        setCurrentPhotoIndex(0);
        setIsListVisible(false);
    };

    if (!isPremium) {
        return (
            <Box
                display='flex'
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                height="100vh"
                textAlign={'center'}
                p={2}>
                <Typography variant='h5' sx={{
                    mb: 2,
                    fontWeight: 'bold'
                }}>
                    Метчи разблокируются после покупки премиума.
                </Typography>
                <Typography sx={{ mb: 4 }}>
                    Оформить премиум можно в лично кабинете или по кнопке ниже. Премиум позволит просматривать метчи и многое другое.
                </Typography>
                <Button
                    variant='contained'
                    color="primary"
                    onClick={() => navigate('/premium')}
                >
                    Просмотреть план
                </Button>
            </Box>
        );
    }

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
                            {people.map((person, index) => (
                                <React.Fragment key={person.id}>
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
                                                src={person.imageUrl}
                                                alt={person.name}
                                                sx={{ width: 48, height: 48 }}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText primary={person.name} />
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
                    src={allPhotos[currentPhotoIndex]}
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

            {/* Просмотр профиля */}
            <Box
                textAlign='center'
                mb={2}
            >
                <Button
                    variant='contained'
                    color="secondary"
                    sx={{
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        textTransform: 'none',
                        padding: '10px 16px',
                    }}
                    onClick={() => console.log("View profile")}
                >
                    View Profile
                </Button>
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
                    Match {currentMatchIndex + 1} of {people.length}
                </Typography>
                <IconButton aria-label="Next match" onClick={handleNextMatch}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default MatchesPage;
