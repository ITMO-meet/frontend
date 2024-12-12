import React from 'react';
import { ListItem, Box } from '@mui/material';

interface UserMessageProps {
  message: {
    sender: 'me' | 'them';
    text: string;
  };
}

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  return (
    <ListItem
      sx={{
        display: 'flex',
        justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
        padding: 0,
      }}
    >
      <Box
        sx={{
          maxWidth: '70%',
          bgcolor: message.sender === 'me' ? '#dcf8c6' : '#ffffff',
          color: 'black',
          borderRadius: message.sender === 'me' ? '15px 15px 5px 15px' : '15px 15px 15px 5px',
          padding: '8px 12px',
          margin: '4px',
          wordBreak: 'break-word',
          boxShadow: 1,
        }}
      >
        {message.text}
      </Box>
    </ListItem>
  );
};

export default UserMessage;
