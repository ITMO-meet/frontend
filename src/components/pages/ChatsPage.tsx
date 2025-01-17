import { Box, Typography } from '@mui/material';
import React from 'react';
import NavBar from '../basic/NavBar';


const ChatsPage: React.FC = () => {
    return (
        <Box position="relative" minHeight="100vh" display="flex" flexDirection="column">

            {/* Header with Chats title */}
            <Box width="100%" position="fixed" top={0} bgcolor="white" display="flex" justifyContent="space-between" alignItems="center" p={2}>
                <Typography variant="h4"
                align="center"
                gutterBottom
                sx={{
                    color: '#4a4a4a', // Тёмно-серый цвет заголовка
                    fontFamily: "'Poppins', Arial, sans-serif",
                    fontWeight: 600,
                }}>Чаты</Typography>
            </Box>

            {/* Navigation Bar */}
            <Box width="100%" position="fixed" bottom={0} left={0} zIndex={2} bgcolor="white">
                <NavBar />
            </Box>
        </Box>
    );
};

export default ChatsPage;
