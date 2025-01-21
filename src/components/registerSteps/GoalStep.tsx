// src/components/registerSteps/GoalStep.tsx

import { Box, Typography, Card, CardContent } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { selectRelationship, fetchPreferences } from '../../api/register';
import { useError } from '../../contexts/ErrorContext';
import theme from '../theme';
import { Preference } from "../../types";
import RoundButton from "../basic/RoundButton"; // If needed
import { userData } from '../../stores/UserDataStore';

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
                setAllGoals(preferences);
                /* eslint-disable @typescript-eslint/no-explicit-any */
            } catch (err: any) {
                console.error("Error fetching preferences:", err);
                showError(err.message || "Ошибка при загрузке предпочтений");
            } finally {
                setLoading(false);
            }
        };

        fetchAndSetGoals();
    }, [showError]);

    const handleSubmit = async () => {
        if (!selectedGoalId) {
            showError('Выберите ваше предпочтение');
            return;
        }
        try {
            if (selectedGoalId != userData.getRelationshipPreferenceId()) {
                await selectRelationship({ isu, relationship_preference: [selectedGoalId] });
                userData.setRelationshipPreferenceId(selectedGoalId, false);
            }
            onNext({ goal: selectedGoalId }); // Sending the goal ID
            /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch (e: any) {
            showError(e.message || "Ошибка при загрузке предпочтений");
        }
    };

    // Optional: Define titles and descriptions if not present in Preference
    // If Preference already includes 'title' and 'description', you can omit this mapping
    const mapPreferenceToDisplay = (preference: Preference) => ({
        id: preference.id,
        title: preference.title || preference.text, // Use 'title' if available, else fallback to 'text'
        description: preference.description || '', // Provide a default description
    });

    if (loading) {
        return (
            <Box padding="20px" textAlign="center">
                <Typography variant="h6">Загрузка целей...</Typography>
            </Box>
        );
    }

    return (
        <Box style={{ padding: '20px' }}> {/* Обертка с отступами */}
            <Typography variant="h5" align='center' sx={{ marginBottom: "20px" }}>
                Что вы ищите?
            </Typography> {/* Заголовок */}
            <Typography variant="h6" align='center' sx={{ marginBottom: "20px" }}>
                Это можно поменять в будущем
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
                Продолжить
            </RoundButton>
        </Box>
    );
};

export default GoalStep;
