import React, { useState } from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate, useParams } from 'react-router-dom';


interface UserProfilePageProps {
    people: Array<{
        id: number;
        name: string;
        imageUrl: string;
        photos: string[];
        mainFeatures: { text: string; icon: JSX.Element }[];
        interests: { text: string; icon: JSX.Element }[];
    }>;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ people }) => {
    const navigate = useNavigate();

    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const { id } = useParams<{ id: string }>();
    const currentUser = id ? people.find((person) => person.id === Number(id)) : null;

    if (!currentUser) {
        return (
            <Typography variant="h6" textAlign="center">
                Profile not found.
            </Typography>
        );
    }
    const allPhotos = [currentUser.imageUrl, ...currentUser.photos];
    const [isStudent, setIsStudent] = useState(true); // PLACEHOLDER. RN only for students

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
                <IconButton onClick={handleGoBack} sx={{ mr: 2 }}>
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
                    Profile
                </Typography>
            </Box>

            {/* Username */}
            <Box display="flex" minHeight="10px">
                <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'left', flexGrow: 1 }}>
                    {currentUser.name}
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
                    alt={`${currentUser.name} photo ${currentPhotoIndex + 1}`}
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

            {/* Вуз */}
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
                                {id === 0 ? 'LVL: ' : id === 1 ? 'Faculty: ' : id === 2 ? 'Group: ' : 'ITMO ID: '}
                                {item.text}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

export default UserProfilePage;