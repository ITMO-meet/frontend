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
import { Message, ChatProps } from '../types';
import UserMessage from './UserMessage';

const Messages: React.FC<ChatProps> = ({ contacts }) => {
    const { id } = useParams<{ id: string }>();
    const contactId = Number(id); // Convert URL param to number
    const navigate = useNavigate();
    const contact = contacts.find((c) => c.id === contactId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (contact) {
      const initialMessages: Message[] = [
        { sender: 'me', text: `Hey, how are you, ${contact.name}?` },
        { sender: 'them', text: 'I am good, thanks! How about you?' },
      ];
      setMessages(initialMessages);
    }
  }, [contact]);

  const handleSend = () => {
    if (inputValue.trim() !== '') {
      setMessages((prevMessages) => [
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
        <Avatar src={contact.pfp} sx={{ width: 40, height: 40, mx: 1 }} />
        <Typography variant="h6">{contact.name}</Typography>
      </Paper>

      {/* Messages List */}
      <List
        sx={{
          mt: 8,
          mb: 2,
          px: 2,
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 200px)',
        }}
      >
        {messages.map((message, index) => (
          <UserMessage key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </List>

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
          placeholder="Type a message"
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
