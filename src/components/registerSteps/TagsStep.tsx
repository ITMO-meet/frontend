//src/components/registerSteps/TagsStep.tsx

import { Box, Typography, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { selectTags, fetchTags} from '../../api/register'; // Import Tag
import { useError } from '../../contexts/ErrorContext';
import {Tag} from "../../types";
import RoundButton from "../basic/RoundButton";

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
                showError(err.message || "Ошибка при загрузке тегов");
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
            showError('Выберите хотя бы один тег');
            return;
        }
        try {
            await selectTags({ isu, tags: selectedTags });
            onNext({ tags: selectedTags });
            /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch(e: any) {
            showError(e.message || "Ошибка при загрузке тегов");
        }
    };

    if (loading) {
        return (
            <Box padding="20px" textAlign="center">
                <Typography variant="h6">Загрузка тегов...</Typography>
            </Box>
        );
    }

    return (
        <Box padding="20px">
            <Typography variant="h5" align="center" mb={2}>Выберите теги</Typography>
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
            <RoundButton
                onClick={handleSubmit} // Обработчик клика по кнопке
                disabled={selectedTags.length === 0} // Кнопка отключена, если нет выбранных тегов
                sx={{ width: "100%", marginTop: "20px" }} // Стили для кнопки
            >
                Продолжить
            </RoundButton>
        </Box>
    );
};

export default TagsStep;
