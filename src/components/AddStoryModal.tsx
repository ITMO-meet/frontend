/* c8 ignore start */
// Modal is temp and will be changed, doesn't need tests

import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
} from '@mui/material';
import { addStory } from '../api/apiClient';

interface AddStoryModalProps {
  open: boolean;
  onClose: () => void;
}

const AddStoryModal: React.FC<AddStoryModalProps> = ({ open, onClose }) => {
  const [storyUrl, setStoryUrl] = useState('');

    const handleSubmit = async () => {
        try {
            await addStory(storyUrl);
            setStoryUrl('');
            onClose();
        } catch (error) {
            console.error('Error adding story:', error);
        }
    };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-story-modal-title"
      aria-describedby="add-story-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="add-story-modal-title" variant="h6" component="h2" gutterBottom>
          Add New Story
        </Typography>
        <TextField
          fullWidth
          label="Story Image URL"
          variant="outlined"
          value={storyUrl}
          onChange={(e) => setStoryUrl(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Add Story
        </Button>
      </Box>
    </Modal>
  );
};

export default AddStoryModal;
