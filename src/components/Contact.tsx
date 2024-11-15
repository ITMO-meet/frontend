import React from 'react';
import { Box, Typography, Card, CardActionArea, CardContent, Avatar, Stack } from '@mui/material';
import { Contact } from '../types';

const ContactCard: React.FC<{ contact: Contact, handleClick: (id: number) => void }> = ({ contact, handleClick }) => {
    return <Card
          key={contact.id}
          sx={{
            mb: 2,
            borderRadius: '16px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          }}
        >
          <CardActionArea onClick={() => handleClick(contact.id)}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={contact.pfp} sx={{ width: 56, height: 56 }} />
                <Box>
                  <Typography variant="h6">{contact.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {contact.lastMessage}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
}

export default ContactCard;
