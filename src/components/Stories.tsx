import React, { useState } from 'react';
import { Box, Avatar, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import StoryViewer from './StoryViewer';
import { useNavigate } from 'react-router-dom';
import { logEvent } from '../analytics';
import { Profile } from '../api/profile';

interface StoriesProps {
  stories: Array<{
    id: string;
    isu: number;
    url: string;
    expiration_date: number;
  }>;
  people: Profile[];
  onAddStory: () => void;
}

const Stories: React.FC<StoriesProps> = ({ stories, people}) => {
  const [openStoryViewer, setOpenStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const navigate = useNavigate();

  const storiesWithContent = stories
    .map((story) => {
      const person = people.find((p) => p.isu === story.isu);
      return person
        ? { story, person }
        : null;
    })
    .filter((entry): entry is { story: typeof stories[0]; person: typeof people[0] } => entry !== null);

  const handleStoryClick = (index: number) => {
    logEvent('Stories', 'View story clicked', 'View Story Button');
    setCurrentStoryIndex(index);
    setOpenStoryViewer(true);
  };

  const handleCloseStoryViewer = () => {
    setOpenStoryViewer(false);
  };

  const handleAddStory = () => {
    navigate('/add-story');
    logEvent('Stories', 'Add story clicked', 'Add Story Button');
  };

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
            onClick={handleAddStory}
            sx={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              border: '2px solid transparent',
              background: 'linear-gradient(135deg, #2d8dfa 0%, #2d34fa 25%, #b92dfa 50%, #d12dfa 75%, #fa2d2d 100%)',
              padding: 0,
              '&:hover': {
                background: 'linear-gradient(135deg, #2d8dfa 0%, #2d34fa 25%, #b92dfa 50%, #d12dfa 75%, #fa2d2d 100%)',
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
            Ваша история
          </Typography>
        </Box>

        {/* Other Stories */}
        {storiesWithContent.map((entry, index) => (
          <Box
            key={entry.story.id}
            sx={{ position: 'relative', mr: 2, cursor: 'pointer' }}
            onClick={() => handleStoryClick(index)}
          >
            <Box
              data-testid="activity"
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2d8dfa 0%, #2d34fa 25%, #b92dfa 50%, #d12dfa 75%, #fa2d2d 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px',
              }}
            >
              <Avatar
                src={entry.person.logo}
                alt={entry.person.username}
                sx={{
                  width: 66,
                  height: 66,
                }}
              />
            </Box>
            <Typography variant="caption" align="center" display="block">
              {entry.person.username}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Story Viewer */}
      {openStoryViewer && (
        <StoryViewer
          storiesWithContent={storiesWithContent}
          initialIndex={currentStoryIndex}
          onClose={handleCloseStoryViewer}
        />
      )}
    </>
  );
};

export default Stories;
