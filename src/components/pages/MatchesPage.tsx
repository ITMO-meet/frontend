import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Paper, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, Button } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { usePremium } from '../../contexts/PremiumContext';
import { useNavigate } from 'react-router-dom';
import { logEvent, logPageView } from '../../analytics';
import { AnimatePresence, motion } from 'framer-motion';
import { Profile } from '../../api/profile';
import { matchesStore } from '../../stores/MatchesStore';
import { observer } from 'mobx-react-lite';
import StraightenIcon from '@mui/icons-material/Straighten';
import ChurchIcon from '@mui/icons-material/Church';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';

const MatchesPage: React.FC = observer(() => {
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isListVisible, setIsListVisible] = useState(false);

    const { isPremium } = usePremium();
    const navigate = useNavigate();

    const [direction, setDirection] = useState(1);

    const matches = matchesStore.matches;
    const currentMatch = matches[currentMatchIndex];
    const allPhotos = currentMatch ? [currentMatch.logo, ...currentMatch.photos] : [];

    useEffect(() => { matchesStore.loadMatches() }, [])

    useEffect(() => {
        logPageView("/matches")
        if (!isPremium) {
            logEvent("Matches", "User without premium tried to view matches", "User action (without premium)");
        }
    }, []);

    const handleNextMatch = () => {
        setDirection(1);
        setCurrentMatchIndex((prevIndex) => (prevIndex + 1) % matches.length);
        setCurrentPhotoIndex(0);
    };

    const handlePrevMatch = () => {
        setDirection(-1)
        setCurrentMatchIndex((prevIndex) => (prevIndex - 1 + matches.length) % matches.length);
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

    const getFeatureValue = (profile: Profile, icon: string) =>
        profile.mainFeatures.find((feature) => feature.icon === icon)?.text || "Unknown";

    const renderMainFeatures = (profile: Profile) => {
        const features = [
            { icon: <StraightenIcon />, text: `${getFeatureValue(profile, "height")}` },
            { icon: <MonitorWeightIcon />, text: `${getFeatureValue(profile, "weight")}` },
            { icon: <Typography sx={{ fontSize: 20 }}>♈️</Typography>, text: `${getFeatureValue(profile, "zodiac_sign")}` },
            { icon: <Typography>👤</Typography>, text: `${getFeatureValue(profile, "gender")}` },
            { icon: <Typography>🎂</Typography>, text: `${getFeatureValue(profile, "birthdate")}` },
            { icon: <ChurchIcon />, text: `${getFeatureValue(profile, "worldview")}` },
            { icon: <ChildCareIcon />, text: `${getFeatureValue(profile, "children")}` },
            { icon: <LocalBarIcon />, text: `${getFeatureValue(profile, "alcohol")}` },
            { icon: <SmokingRoomsIcon />, text: `${getFeatureValue(profile, "smoking")}` },
        ];

        return (
            <Box mt={2}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Main Features
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                    {features.map((feature, index) => (
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
            </Box>
        );
    };

    const renderLanguages = (profile: Profile) => {
        // Ищем массив языков в mainFeatures
        const languagesFeature = profile.mainFeatures.find(
            (feature) => Array.isArray(feature) && feature[0]?.icon === "languages"
        );

        const languages = languagesFeature || [];

        return (
            <Box mt={2}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Languages
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                    {languages.map((language: { text: string; icon: string }, index: number) => (
                        <Box
                            key={index}
                            display="flex"
                            alignItems="center"
                            sx={{
                                bgcolor: 'rgba(214, 231, 255, 0.8)',
                                borderRadius: '8px',
                                padding: '4px 8px',
                                gap: '4px',
                            }}
                        >
                            <Typography>{language.text}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    };

    const renderInterests = (profile: Profile) => (
        <Box mt={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Interests
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
                {profile.interests.map((interest, index) => (
                    <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        sx={{
                            bgcolor: 'rgba(214, 231, 255, 0.8)',
                            borderRadius: '8px',
                            padding: '4px 8px',
                            gap: '4px',
                        }}
                    >
                        <Typography>{interest.text}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );


    const animationVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" },
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
            transition: { duration: 0.5, ease: "easeIn" },
        }),
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
                            {matches.map((match, index) => (
                                <React.Fragment key={match.isu}>
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
                                                src={match.logo}
                                                alt={match.username}
                                                sx={{ width: 48, height: 48 }}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText primary={match.username} />
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
                    {currentMatch.username}
                </Typography>
            </Box>

            {/* Фотографии */}
            <Box position="relative" height="400px" display="flex" justifyContent="center" alignItems="center" overflow="hidden">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentMatch.isu}
                        variants={animationVariants}
                        custom={direction}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        style={{
                            position: 'absolute',
                            textAlign: 'center',
                        }}
                    >

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
                                alt={`${currentMatch.username} photo ${currentPhotoIndex + 1}`}
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
                    </motion.div>
                </AnimatePresence>
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
                    onClick={() => navigate(`/user-profile/${currentMatch.isu}`)}
                >
                    View Profile
                </Button>
            </Box>

            {/* Фичи, языкии интересы */}
            {renderMainFeatures(currentMatch)}
            {renderLanguages(currentMatch)}
            {renderInterests(currentMatch)}

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
});

export default MatchesPage;
