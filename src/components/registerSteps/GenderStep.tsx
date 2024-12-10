// GenderStep.tsx
import { Box, Typography, Button } from '@mui/material';
import React, { useState } from 'react';
import { selectPreferences } from '../../api/register';
import { useError } from '../../contexts/ErrorContext';

interface GenderStepProps {
    isu: number;
    onNext: () => void;
}

const options = ["Male", "Female", "Everyone"];

const GenderStep: React.FC<GenderStepProps> = ({ isu, onNext }) => {
    const { showError } = useError();
    const [gender, setGender] = useState('');

    const handleSubmit = async () => {
        if (!gender) {
            showError('Please select a gender preference');
            return;
        }
        try {
            await selectPreferences({ isu, gender_preference: gender });
            onNext();
        } catch(e: any) {
            showError(e.message);
        }
    };

    return (
        <Box padding="20px">
            <Typography variant="h5" align="center" mb={2}>Show me</Typography>
            <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
                {options.map(o => (
                    <Button
                        key={o}
                        variant={o === gender ? 'contained' : 'outlined'}
                        onClick={() => setGender(o)}
                    >
                        {o}
                    </Button>
                ))}
            </Box>
            <Button onClick={handleSubmit} disabled={!gender} fullWidth sx={{mt:2}}>
                Next
            </Button>
        </Box>
    );
};

export default GenderStep;
