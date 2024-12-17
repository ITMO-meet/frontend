// TagsStep.tsx
import { Box, Typography, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { selectTags, fetchTags } from '../../api/register';
import { useError } from '../../contexts/ErrorContext';

interface TagsStepProps {
    isu: number;
    onNext: (data: { tags: string[] }) => void;
}

const TagsStep: React.FC<TagsStepProps> = ({ isu, onNext }) => {
    const { showError } = useError();
    const [allTags, setAllTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        fetchTags().then(setAllTags).catch(err => showError(err.message));
    }, [showError]);

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = async () => {
        if (selectedTags.length === 0) {
            showError('Please select at least one tag');
            return;
        }
        try {
            await selectTags({ isu, tags: selectedTags });
            onNext({ tags: selectedTags });
        } catch(e: any) {
            showError(e.message);
        }
    };

    return (
        <Box padding="20px">
            <Typography variant="h5" align="center" mb={2}>Select Tags</Typography>
            <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
                {allTags.map(tag => (
                    <Button
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'contained' : 'outlined'}
                        onClick={() => toggleTag(tag)}
                    >
                        {tag}
                    </Button>
                ))}
            </Box>
            <Button onClick={handleSubmit} disabled={selectedTags.length === 0} fullWidth sx={{mt:2}}>
                Next
            </Button>
        </Box>
    );
};

export default TagsStep;
