import React, { useState } from 'react';
import { Box, Typography, IconButton, Avatar, Paper } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PhotoListing from '../basic/PhotoListing';
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
  const currentMatch = matches[currentMatchIndex];

  const handleNextMatch = () => {
    setCurrentMatchIndex((prevIndex) => (prevIndex + 1) % matches.length);
  };

  const handlePrevMatch = () => {
    setCurrentMatchIndex((prevIndex) => (prevIndex - 1 + matches.length) % matches.length);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" p={2}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton sx={{ mr: 2 }}>
          <ListIcon />
        </IconButton>
      </Box>
      
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {currentMatch.name}
        </Typography>
      
      {/* Фотографии */}
      <Box mb={2}>
        <PhotoListing photos={currentMatch.photos} />
      </Box>

      {/* Фичи интересы */}
      <Paper sx={{ p: 2, mb: 2 }}>
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
        <IconButton onClick={handlePrevMatch}>
          <ArrowBackIosIcon />
        </IconButton>
        <Typography>Match {currentMatchIndex + 1} of {matches.length}</Typography>
        <IconButton onClick={handleNextMatch}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MatchesPage;
