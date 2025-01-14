import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Paper, Button, Modal } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate, useParams } from 'react-router-dom';
import BlockIcon from '@mui/icons-material/Block';
import { logEvent } from '../../analytics';
import PageWrapper from '../../PageWrapper';
import { observer } from "mobx-react-lite";
import { userProfileStore } from '../../stores/UserProfileStore';
import { Profile } from '../../api/profile';
import StraightenIcon from '@mui/icons-material/Straighten';
import ChurchIcon from '@mui/icons-material/Church';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import BadgeIcon from '@mui/icons-material/Badge';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import { blockPerson } from '../../api/matches';
import { userData } from '../../stores/UserDataStore';

const UserProfilePage: React.FC = observer(() => {
    const navigate = useNavigate();

    useEffect(() => { logEvent("UserProfile", "User profile viewed", "") }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            userProfileStore.loadProfile(Number(id));
        }
        return () => {
            userProfileStore.clearProfile();
        };
    }, [id]);

    const currentUser = userProfileStore.profile;


    if (!currentUser) {
        return (
            <Typography variant="h6" textAlign="center">
                Profile not found.
            </Typography>
        );
    }
    const allPhotos = [currentUser.logo, ...currentUser.photos];

    const handleNextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % allPhotos.length);
    };

    const handlePrevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + allPhotos.length) % allPhotos.length);
    };

    const handleGoBack = () => {
        navigate(-1)
    };

    const getFeatureValue = (profile: Profile, icon: string) =>
        profile.mainFeatures.find((feature) => feature.icon === icon)?.text || "Unknown";

    const handleBlock = async () => {
        if (!currentUser?.isu) {
            console.error("Viewed user isu is not defined");
            return;
        }
        try {
            await blockPerson(userData.getIsu(), currentUser.isu);
            setIsModalOpen(false);
            navigate('/matches');
        } catch (error) {
            console.error("Error blocking user:", error);
        }
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleViewSchedule = () => {
        navigate('/schedule', { state: { itmoId: currentUser.isu } })
    }


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

    const renderItmo = (profile: Profile) => {
        const details = [
            { text: profile.itmo.find((item) => item.icon === "course")?.text || "Unknown", icon: <SchoolIcon />, label: "Course: " },
            { text: profile.itmo.find((item) => item.icon === "faculty")?.text || "Unknown", icon: <HomeIcon />, label: "Faculty: " },
            { text: profile.isu.toString(), icon: <BadgeIcon />, label: "ITMO ID: " },
        ];

        return (
            <Box display="flex" flexDirection="column" gap={1}>
                {details.map((detail, index) => (
                    <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        sx={{
                            bgcolor: 'rgba(214, 231, 255, 0.8)',
                            border: '1px solid rgba(214, 231, 255, 0.8)',
                            borderRadius: '8px',
                            padding: '8px',
                            gap: '8px',
                        }}
                    >{detail.icon}
                        <Typography>
                            {detail.label}
                            {detail.text}
                        </Typography>
                    </Box>
                ))}
            </Box>
        );
    };

    return (
        <PageWrapper direction={1}>
            <Box display="flex" flexDirection="column" minHeight="100vh" p={2}>
                <Box display="flex" alignItems="center" mb={2}>
                    <IconButton onClick={handleGoBack} sx={{ mr: 2 }} aria-label="Go back">
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Profile
                    </Typography>
                </Box>

                {/* Username */}
                <Box display="flex" minHeight="10px">
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 'bold',
                            fontFamily: "'Roboto', sans-serif",
                            letterSpacing: '1.2px',
                            textShadow: '0px 2px 4px rgba(0, 0, 0, 0.6)',
                        }}
                    >
                        {currentUser.username}
                    </Typography>
                </Box>

                {/* Photos */}
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
                        alt={`${currentUser.username} photo ${currentPhotoIndex + 1}`}
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

                {/* Main Features and Interests */}
                <Paper
                    sx={{
                        p: 2,
                        mb: 2,
                        bgcolor: '#f5f5f5',
                        borderRadius: '12px',
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Bio
                    </Typography>
                    <Typography
                        sx={{
                            mb: 2,
                            fontStyle: 'italic',
                            bgcolor: 'rgba(245, 245, 245, 0.8)',
                            borderRadius: '8px',
                            p: 2,
                            fontSize: '16px',
                            border: '1px solid rgba(214, 231, 255, 0.8)',
                        }}
                    >
                        {currentUser.bio || "No bio available"}
                    </Typography>
                    {renderMainFeatures(currentUser)}
                    {renderLanguages(currentUser)}
                    {renderInterests(currentUser)}
                </Paper>

                {/* ITMO Details */}
                <Paper
                    sx={{
                        p: 2,
                        mb: 2,
                        bgcolor: '#f5f5f5',
                        borderRadius: '12px',
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        ITMO
                    </Typography>
                    {currentUser.isStudent ? (
                        renderItmo(currentUser)
                    ) : (
                        <Typography variant="h6" textAlign="center">
                            This person is not a student.
                        </Typography>
                    )}
                    {currentUser.isStudent && (
                        <Box textAlign="center" mt={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleViewSchedule}
                            >
                                View Schedule
                            </Button>
                        </Box>
                    )}
                </Paper>

                {/* Block Section */}
                <Box textAlign="center" mt={2}>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<BlockIcon />}
                        onClick={handleOpenModal}
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                            borderRadius: '10px',
                            padding: '10px 20px',
                        }}
                    >
                        Block User
                    </Button>
                </Box>

                {/* Modal section */}
                <Modal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Paper
                        sx={{
                            width: '80%',
                            maxWidth: '350px',
                            margin: '20% auto',
                            p: 3,
                            borderRadius: 2,
                            boxShadow: 24,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Это действие нельзя отменить
                        </Typography>
                        <Box display="flex" justifyContent="space-around">

                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleCloseModal}
                            >
                                Закрыть
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleBlock}
                            >
                                Block
                            </Button>
                        </Box>
                    </Paper>
                </Modal>
            </Box>
        </PageWrapper>
    );
});

export default UserProfilePage;