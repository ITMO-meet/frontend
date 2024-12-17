// UsernameStep.tsx
import { Box, Typography, TextField, Button } from '@mui/material';
import React, { useState } from 'react';
import { selectUsername } from '../../api/register';
import { useError } from '../../contexts/ErrorContext';

interface UsernameStepProps {
    isu: number;
    onNext: (data: { username: string }) => void;  // match test
}

const UsernameStep: React.FC<UsernameStepProps> = ({ isu, onNext }) => {
    const { showError } = useError();
    const [username, setUsername] = useState('');

    const handleSubmit = async () => {
        if (!username.trim()) {
            showError('Please enter a username');
            return;
        }
        try {
            await selectUsername({ isu, username: username.trim() });
            // Pass the object so the test can verify
            onNext({ username: username.trim() });
            /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch(e: any) {
            showError(e.message);
        }
    };

    return (
        <Box padding="20px">
            <Typography variant="h5" align="center" mb={2}>Choose a username</Typography>
            <TextField
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                label="Username"
                sx={{ mb:2 }}
            />
            <Button onClick={handleSubmit} disabled={!username.trim()} fullWidth>
                Next
            </Button>
        </Box>
    );
};

export default UsernameStep;
