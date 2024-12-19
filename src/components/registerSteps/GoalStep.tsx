// src/components/registerSteps/GoalStep.tsx

import { Box, Typography, Card, CardContent } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { selectRelationship, fetchPreferences } from '../../api/register';
import { useError } from '../../contexts/ErrorContext';
import theme from '../theme';
import { Preference } from "../../types";
import RoundButton from "../basic/RoundButton"; // If needed

interface GoalStepProps {
    isu: number;
    onNext: (data: { goal: string }) => void;
}

const GoalStep: React.FC<GoalStepProps> = ({ isu, onNext }) => {
    const { showError } = useError();
    const [allGoals, setAllGoals] = useState<Preference[]>([]);
    const [selectedGoalId, setSelectedGoalId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true); // Loading state

    useEffect(() => {
        const fetchAndSetGoals = async () => {
            try {
                const preferences = await fetchPreferences();
                console.log("Fetched preferences:", preferences); // Debugging
                setAllGoals(preferences);
                /* eslint-disable @typescript-eslint/no-explicit-any */
            } catch (err: any) {
                console.error("Error fetching preferences:", err);
                showError(err.message || "Failed to load preferences");
            } finally {
                setLoading(false);
            }
        };

        fetchAndSetGoals();
    }, [showError]);

    const handleSubmit = async () => {
        if (!selectedGoalId) {
            showError('Please select your relationship preference');
            return;
        }
        try {
            await selectRelationship({ isu, relationship_preference: [selectedGoalId] });
            onNext({ goal: selectedGoalId }); // Sending the goal ID
            /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch (e: any) {
            showError(e.message || "Failed to select relationship preference");
        }
    };

    // Optional: Define titles and descriptions if not present in Preference
    // If Preference already includes 'title' and 'description', you can omit this mapping
    const mapPreferenceToDisplay = (preference: Preference) => ({
        id: preference.id,
        title: preference.title || preference.text, // Use 'title' if available, else fallback to 'text'
        description: preference.description || 'No description provided.', // Provide a default description
    });

    if (loading) {
        return (
            <Box padding="20px" textAlign="center">
                <Typography variant="h6">Loading goals...</Typography>
            </Box>
        );
    }

    return (
        <Box style={{ padding: '20px' }}> {/* Обертка с отступами */}
            <Typography variant="h5" align='center' sx={{ marginBottom: "20px" }}>
                What are you looking for?
            </Typography> {/* Заголовок */}
            <Typography variant="h6" align='center' sx={{ marginBottom: "20px" }}>
                It can be changed at any time
            </Typography> {/* Подзаголовок с инструкцией */}
            {allGoals.map(preference => {
                const { id, title, description } = mapPreferenceToDisplay(preference);
                return (
                    <Card
                        key={id} // Уникальный ключ для каждого элемента
                        onClick={() => setSelectedGoalId(id)} // Обработчик клика для выбора цели
                        sx={{
                            margin: '10px 0', // Отступы между карточками
                            cursor: 'pointer', // Указатель при наведении
                            background: selectedGoalId === id ? theme.palette.secondary.light : "white", // Изменяем фон выбранной карточки
                            border: selectedGoalId === id ? `2px solid ${theme.palette.secondary.main}` : '1px solid #ccc', // Изменяем рамку выбранной карточки
                            transition: 'background 0.3s, border 0.3s', // Плавный переход для фона и рамки
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {title}
                            </Typography> {/* Заголовок цели */}
                            <Typography variant="body2" color="textSecondary">
                                {description} {/* Описание цели */}
                            </Typography>
                        </CardContent>
                    </Card>
                );
            })}
            <RoundButton
                disabled={!selectedGoalId} // Кнопка отключена, если цель не выбрана
                onClick={handleSubmit} // Обработчик клика по кнопке
                sx={{ width: "100%", marginTop: "20px" }} // Стили для кнопки
            >
                Next
            </RoundButton>
        </Box>
    );
};

export default GoalStep;
