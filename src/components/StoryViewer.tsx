import React, { useState, useEffect, useRef } from 'react';
import { Box, Avatar, Typography, IconButton, LinearProgress, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Contact } from '../types';

interface StoryViewerProps {
  contacts: Contact[];
  initialIndex: number;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ contacts, initialIndex, onClose }) => {
  const [currentContactIndex, setCurrentContactIndex] = useState(initialIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const currentContact = contacts[currentContactIndex];
  const currentStory = currentContact.stories[currentStoryIndex];

  useEffect(() => {
    startProgress();

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [currentStoryIndex, currentContactIndex]);

  const startProgress = () => {
    setProgress(0);
    if (timer.current) {
      clearInterval(timer.current);
    }
    timer.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNextStory();
          return 0;
        }
        return prev + 0.5;
      });
    }, 30);
  };

  const handleNextStory = () => {
    if (currentStoryIndex < currentContact.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else if (currentContactIndex < contacts.length - 1) {
      setCurrentContactIndex(currentContactIndex + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose();
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else if (currentContactIndex > 0) {
      setCurrentContactIndex(currentContactIndex - 1);
      setCurrentStoryIndex(contacts[currentContactIndex - 1].stories.length - 1);
    } else {
      onClose();
    }
  };

  const handlePause = () => {
    if (timer.current) {
      clearInterval(timer.current);
    }
  };

  const handleResume = () => {
    startProgress();
  };

  return (
    <Fade in={true}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          zIndex: 1300,
        }}
      >
        <img
          src={currentStory.image}
          alt="Story"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onMouseDown={handlePause}
          onMouseUp={handleResume}
        />

        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 2,
          }}
        >
          {/* Header */}
          <Box>
            {/* Progress Bars */}
            <Box sx={{ display: 'flex' }}>
              {currentContact.stories.map((story, index) => (
                <LinearProgress
                  key={index}
                  variant="determinate"
                  value={
                    index < currentStoryIndex
                      ? 100
                      : index === currentStoryIndex
                        ? progress
                        : 0
                  }
                  sx={{
                    flexGrow: 1,
                    height: 2,
                    bgcolor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'white',
                    },
                    mx: 0.5,
                  }}
                />
              ))}
            </Box>

            {/* User Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Avatar src={currentContact.pfp} alt={currentContact.name} />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {currentContact.name}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                data-testid="close-button"
                onClick={onClose}
                sx={{ color: 'white', zIndex: 1300 }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <IconButton sx={{ color: 'white' }}>
              <FavoriteBorderIcon fontSize="large" />
            </IconButton>
            <IconButton sx={{ color: 'white', ml: 2 }}>
              <ChatBubbleOutlineIcon fontSize="large" />
            </IconButton>
          </Box>
        </Box>

        {/* Clickable Areas */}
        <Box
          data-testid="left-click-area"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '30%',
            height: '100%',
          }}
          onClick={handlePrevStory}
        />
        <Box
          data-testid="right-click-area"
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '30%',
            height: '100%',
          }}
          onClick={handleNextStory}
        />
      </Box>
    </Fade>
  );
};

export default StoryViewer;
