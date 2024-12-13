import React, { useState, useEffect, useRef } from 'react';
import { Box, Avatar, Typography, IconButton, LinearProgress, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

interface StoryViewerProps {
  storiesWithContent: Array<{
    person: {
      isu: number;
      username: string;
      logo: string;
    };
    story: {
      id: string;
      url: string;
      expiration_date: number;
    };
  }>;
  initialIndex: number;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ storiesWithContent, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const currentEntry = storiesWithContent[currentIndex]
  useEffect(() => {
    startProgress();

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [currentIndex]);

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
    if (currentIndex < storiesWithContent.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
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
          src={currentEntry.story.url}
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
              {storiesWithContent.map((_, index) => (
                <LinearProgress
                  key={index}
                  variant="determinate"
                  value={
                    index < currentIndex
                      ? 100
                      : index === currentIndex
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
              <Avatar src={currentEntry.person.logo} alt={currentEntry.person.username} />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {currentEntry.person.username}
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
