<<<<<<< HEAD
import { Box, Typography } from '@mui/material';
import React from 'react';
import NavBar from '../basic/NavBar';


const MatchesPage: React.FC = () => {
    return (
        <Box position="relative" minHeight="100vh" display="flex" flexDirection="column">

            {/* Header with Chats title */}
            <Box width="100%" position="fixed" top={0} bgcolor="white" display="flex" justifyContent="space-between" alignItems="center" p={2}>
                <Typography variant="h5">Matches</Typography>
            </Box>

            {/* Navigation Bar */}
            <Box width="100%" position="fixed" bottom={0} left={0} zIndex={2} bgcolor="white">
                <NavBar />
            </Box>
        </Box> 
    );
};
=======
/* c8 ignore start */

import React from 'react';
import { Box, Typography } from '@mui/material';

const MatchesPage: React.FC = () => (
  <Box p={2}>
    <Typography variant="h4">Matches</Typography>
    <Typography>List of matches will appear here.</Typography>
  </Box>
);
>>>>>>> 968d60fea55ab33f8efba8f7bc5fa5a8db67b66e

export default MatchesPage;
