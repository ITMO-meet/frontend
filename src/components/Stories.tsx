import React, { useState } from 'react';
import { Box, Avatar, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Contact } from '../types';
import StoryViewer from './StoryViewer';

interface StoriesProps {
  contacts: Contact[];
  onAddStory: () => void;
}

const Stories: React.FC<StoriesProps> = ({ contacts, onAddStory }) => {
  const [openStoryViewer, setOpenStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const handleStoryClick = (index: number) => {
    setCurrentStoryIndex(index);
    setOpenStoryViewer(true);
  };

  const handleCloseStoryViewer = () => {
    setOpenStoryViewer(false);
  };

  const storiesWithContent = contacts.filter(contact => contact.stories.length > 0);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          padding: '8px 0',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {/* Your Story */}
        <Box sx={{ position: 'relative', mr: 2 }}>
          <IconButton
            onClick={onAddStory}
            sx={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              border: '2px solid transparent',
              background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              padding: 0,
              '&:hover': {
                background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              },
            }}
          >
            <Avatar
              src="https://randomuser.me/api/portraits/lego/1.jpg"
              alt="Your Story"
              sx={{
                width: 66,
                height: 66,
                border: '2px solid white',
              }}
            />
            <AddIcon
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'white',
                borderRadius: '50%',
                fontSize: 20,
              }}
            />
          </IconButton>
          <Typography variant="caption" align="center" display="block">
            Your Story
          </Typography>
        </Box>

        {/* Other Stories */}
        {storiesWithContent.map((contact, index) => (
          <Box
            key={contact.id}
            sx={{ position: 'relative', mr: 2, cursor: 'pointer' }}
            onClick={() => handleStoryClick(index)}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px',
              }}
            >
              <Avatar
                src={contact.pfp}
                alt={contact.name}
                sx={{
                  width: 66,
                  height: 66,
                }}
              />
            </Box>
            <Typography variant="caption" align="center" display="block">
              {contact.name}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Story Viewer */}
      {openStoryViewer && (
        <StoryViewer
          contacts={storiesWithContent}
          initialIndex={currentStoryIndex}
          onClose={handleCloseStoryViewer}
        />
      )}
    </>
  );
};

export default Stories;
