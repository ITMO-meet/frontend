import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  List,
  Paper,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useParams, useNavigate } from 'react-router-dom';
import UserMessage from './UserMessage';
import PageWrapper from '../PageWrapper';

interface MessagesProps {
  people: Array<{
    isu: number;
    username: string;
    logo: string;
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

const Messages: React.FC<MessagesProps> = ({ people, messages }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contact = people.find((person) => person.isu === Number(id))

  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'me' | 'them'; text: string }>
  >([]);
  const [inputValue, setInputValue] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (contact) {
      const initialMessages = messages
        .filter(
          (message) =>
            message.sender_id === contact.isu || message.receiver_id === contact.isu
        )
        .map((message) => ({
          sender: message.sender_id === contact.isu ? 'them' : 'me' as 'me' | 'them',
          text: message.text,
        }));
      setChatMessages(initialMessages);
    }
  }, [contact, messages]);

  const handleSend = () => {
    if (inputValue.trim() !== '') {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'me', text: inputValue },
      ]);
      setInputValue('');
      scrollToBottom();
      // TODO: Implement actual message sending logic (e.g., API call or RabbitMQ)
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!contact) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Contact not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 7 }}>
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1,
          backgroundColor: '#fff',
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon />
        </IconButton>
        <Box
          onClick={() => navigate(`/user-profile/${contact.isu}`)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            cursor: 'pointer',
            ml: 1,
          }}
        >
          <Avatar src={contact.logo} sx={{ width: 40, height: 40, mx: 1 }} />
          <Typography variant="h6">{contact.username}</Typography>
        </Box>
      </Paper>

      {/* Messages List */}
      <PageWrapper direction={1}>
        <List
          sx={{
            mt: 8,
            mb: 2,
            px: 2,
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 200px)',
          }}
        >
          {chatMessages.map((message, index) => (
            <UserMessage key={index} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </List>
      </PageWrapper>

      {/* Message Input */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          width: '100%',
          px: 2,
          bgcolor: '#fff',
        }}
      >
        <TextField
          fullWidth
          placeholder="Type a message!"
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton color="primary" onClick={handleSend}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default Messages;
