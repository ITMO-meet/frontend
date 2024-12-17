import { Box, Typography, Button } from '@mui/material';
import React, { useState } from 'react';
import { uploadCarousel } from '../../api/register';
import { useError } from '../../contexts/ErrorContext';

interface AdditionalPhotosStepProps {
    isu: number;
    onNext: (data: { additionalPhotos: File[] }) => void;
}

const AdditionalPhotosStep: React.FC<AdditionalPhotosStepProps> = ({ isu, onNext }) => {
    const { showError } = useError();
    const [files, setFiles] = useState<(File | null)[]>([null,null,null,null,null,null]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const f = e.target.files?.[0] || null;
        setFiles((prev) => {
            const copy = [...prev];
            copy[index] = f;
            return copy;
        });
    };

    const handleSubmit = async () => {
        const filtered = files.filter((f): f is File => f instanceof File);
        if (filtered.length === 0) {
            showError('Please select at least one photo');
            return;
        }
        try {
            await uploadCarousel(isu, filtered);
            onNext({ additionalPhotos: filtered });

            /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch(e: any) {
            showError(e.message);
        }
    };

    return (
        <Box padding="20px">
            <Typography variant="h5" align="center" mb={2}>Add additional photos</Typography>
            {files.map((_, i) => (
                <Box key={i} mb={1}>
                    <input type="file" accept="image/*" data-testid={`file-input-${i}`} onChange={(e) => handleChange(e, i)} />
                </Box>
            ))}
            <Button onClick={handleSubmit} fullWidth sx={{mt:2}}>
                Next
            </Button>
        </Box>
    );
};

export default AdditionalPhotosStep;
