import React, { useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ContactCard from '../Contact';
import Stories from '../Stories';
import AddStoryModal from '../AddStoryModal';
import {ChatProps} from '../../types';

const ChatPage: React.FC<ChatProps> = ({ contacts }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);

  const handleClick = (id: string) => {
    navigate(`/chat/${id}`);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStory = () => {
    setIsAddStoryOpen(true);
  };

  const handleCloseAddStory = () => {
    setIsAddStoryOpen(false);
  };

  return (
    <Box sx={{ mt: 2, mx: 2 }}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
        Chats
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Search Contacts"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Activities
      </Typography>

      <Stories contacts={contacts} onAddStory={handleAddStory} />

      <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
        Messages
      </Typography>

      {filteredContacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} handleClick={handleClick} />
      ))}

      {filteredContacts.length === 0 && (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
          No contacts found.
        </Typography>
      )}

      {isAddStoryOpen && (
        <AddStoryModal open={isAddStoryOpen} onClose={handleCloseAddStory} />
      )}
    </Box>
  );
};

export default ChatPage;
