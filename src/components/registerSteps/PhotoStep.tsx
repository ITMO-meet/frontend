// PhotoStep.tsx
import { Box, Typography, Button } from '@mui/material';
import React, { useState } from 'react';
import { uploadLogo } from '../../api/register';
import { useError } from '../../contexts/ErrorContext';

interface PhotoStepProps {
    isu: number;
    onNext: (data: { photo: File }) => void;
}

const PhotoStep: React.FC<PhotoStepProps> = ({ isu, onNext }) => {
    const { showError } = useError();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleSubmit = async () => {
        if (!selectedFile) {
            showError('Please select a photo');
            return;
        }
        try {
            await uploadLogo(isu, selectedFile);
            onNext({ photo: selectedFile });
            /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch(e: any) {
            showError(e.message);
        }
    };

    return (
        <Box padding="20px">
            <Typography variant="h5" align="center" mb={2}>Upload Logo</Typography>
            <input
                type="file"
                accept="image/*"
                data-testid="photo-input"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            <Button onClick={handleSubmit} disabled={!selectedFile} fullWidth sx={{mt:2}}>
                Next
            </Button>
        </Box>
    );
};

export default PhotoStep;
