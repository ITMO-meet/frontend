import React from 'react';
import { Box, Typography, Card, CardActionArea, CardContent, Avatar, Stack } from '@mui/material';

interface ContactProps {
  person: {
    isu: number;
    username: string;
    logo: string;
  };
  lastMessage: string;
  handleClick: (isu: number) => void;
}

const ContactCard: React.FC<ContactProps> = ({ person, lastMessage, handleClick }) => {
  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: '16px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      }}
    >
      <CardActionArea onClick={() => handleClick(person.isu)}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={person.logo} sx={{ width: 56, height: 56 }} />
            <Box>
              <Typography variant="h6">{person.username}</Typography>
              <Typography variant="body2" color="textSecondary">
                {lastMessage}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ContactCard;
