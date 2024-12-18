//src/components/registerSteps/TagsStep.tsx

import { Box, Typography, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { selectTags, fetchTags} from '../../api/register'; // Import Tag
import { useError } from '../../contexts/ErrorContext';
import {Tag} from "../../types";

interface TagsStepProps {
    isu: number;
    onNext: (data: { tags: string[] }) => void;
}

const TagsStep: React.FC<TagsStepProps> = ({ isu, onNext }) => {
    const { showError } = useError();
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Optional: Loading state

    useEffect(() => {
        const fetchAndSetTags = async () => {
            try {
                const tags = await fetchTags();
                if (!Array.isArray(tags)) {
                    throw new Error("Tags data is not an array");
                }
                setAllTags(tags);
                /* eslint-disable @typescript-eslint/no-explicit-any */
            } catch (err: any) {
                console.error("Error fetching tags:", err);
                showError(err.message || "Failed to load tags");
            } finally {
                setLoading(false);
            }
        };

        fetchAndSetTags();
    }, [showError]);

    const toggleTag = (tagId: string) => {
        setSelectedTags((prev) =>
            prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
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
            /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch(e: any) {
            showError(e.message || "Failed to select tags");
        }
    };

    if (loading) {
        return (
            <Box padding="20px" textAlign="center">
                <Typography variant="h6">Loading tags...</Typography>
            </Box>
        );
    }

    return (
        <Box padding="20px">
            <Typography variant="h5" align="center" mb={2}>Select Tags</Typography>
            <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
                {allTags.map(tag => (
                    <Button
                        key={tag.id}
                        variant={selectedTags.includes(tag.id) ? 'contained' : 'outlined'}
                        onClick={() => toggleTag(tag.id)}
                    >
                        {tag.text}
                    </Button>
                ))}
            </Box>
            <Button
                onClick={handleSubmit}
                disabled={selectedTags.length === 0}
                fullWidth
                sx={{ mt: 2 }}
            >
                Next
            </Button>
        </Box>
    );
};

export default TagsStep;
