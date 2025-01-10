import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ContactCard from '../Contact';
import Stories from '../Stories';
import AddStoryModal from '../AddStoryModal';
import { logEvent, logPageView } from '../../analytics';
import { Profile } from '../../api/profile';

interface ChatPageProps {
  people: Profile[];
  stories: Array<{
    id: string;
    isu: number;
    url: string;
    expiration_date: number;
  }>;
  messages: Array<{
    id: string;
    chat_id: string;
    sender_id: number;
    receiver_id: number;
    text: string;
    timestamp: string;
  }>;
}

const ChatPage: React.FC<ChatPageProps> = ({ people, stories, messages }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);

  useEffect(() => { logPageView("/chats") }, []);

  const handleClick = (isu: number) => {
    logEvent("Chats", "Open chat", "Clicked on chat");
    navigate(`/chat/${isu}`);
  };

  const filteredContacts = people.filter(person =>
    person.username.toLowerCase().includes(searchQuery.toLowerCase())
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

      <Stories people={people} stories={stories} onAddStory={handleAddStory} />

      <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
        Messages
      </Typography>

      {filteredContacts.map((person) => (
        <ContactCard
          key={person.isu}
          person={person}
          handleClick={handleClick}
          lastMessage={
            messages.find(
              (message) => message.sender_id === person.isu || message.receiver_id === person.isu
            )?.text || ''
          }
        />
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
