import React, { useState } from 'react';
import { Box, Typography, IconButton, Paper, Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate, useParams } from 'react-router-dom';
import BlockIcon from '@mui/icons-material/Block';

interface UserProfilePageProps {
    people: Array<{
        isu: number;
        username: string;
        bio: string;
        logo: string;
        photos: string[];
        mainFeatures: { text: string; icon: JSX.Element }[];
        interests: { text: string; icon: JSX.Element }[];
        itmo: { text: string; icon: JSX.Element }[];
        isStudent: boolean;
    }>;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ people }) => {
    const navigate = useNavigate();

    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const { id } = useParams<{ id: string }>();
    const currentUser = id ? people.find((person) => person.isu === Number(id)) : null;

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

    return (
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
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Main Features
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    {currentUser.mainFeatures.map((feature, index) => (
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
                    {currentUser.interests.map((interest, index) => (
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
                    <Box display="flex" flexDirection="column" gap={1}>
                        {currentUser.itmo.map((item, id) => (
                            <Box
                                key={id}
                                display="flex"
                                alignItems="center"
                                sx={{
                                    bgcolor: 'rgba(214, 231, 255, 0.8)',
                                    border: '1px solid rgba(214, 231, 255, 0.8)',
                                    borderRadius: '8px',
                                    padding: '8px',
                                    gap: '8px',
                                }}
                            >
                                {item.icon}
                                <Typography>
                                    {id === 0 ? 'Course: ' : id === 1 ? 'Faculty: ' : id === 2 ? 'ITMO ID: ' : ''}
                                    {item.text}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
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
                            onClick={() => navigate('/schedule', { state: { itmoId: currentUser.itmo[2]?.text } })}
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
                    onClick={() => console.log('User blocked')}
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
        </Box>
    );
};

export default UserProfilePage;