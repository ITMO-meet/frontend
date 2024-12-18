//src/components/registerSteps/GoalStep.tsx

import { Box, Typography, Paper, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { selectRelationship, fetchPreferences} from '../../api/register';
import { useError } from '../../contexts/ErrorContext';
import theme from '../theme';
import {Preference} from "../../types"; // If needed

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
        } catch(e: any) {
            showError(e.message || "Failed to select relationship preference");
        }
    };


    if (loading) {
        return (
            <Box padding="20px" textAlign="center">
                <Typography variant="h6">Loading goals...</Typography>
            </Box>
        );
    }

    return (
        <Box padding="20px">
            <Typography variant="h5" align="center" mb={2}>What are you looking for?</Typography>
            <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
                {allGoals.map(goal => (
                    <Paper
                        className="MuiPaper-root"
                        key={goal.id} // Use unique ID as key
                        data-testid={`goal-${goal.id}`}
                        onClick={() => setSelectedGoalId(goal.id)}
                        sx={{
                            padding: '16px',
                            cursor: 'pointer',
                            background: goal.id === selectedGoalId ? theme.palette.secondary.light : 'transparent',
                            border: goal.id === selectedGoalId ? `2px solid ${theme.palette.secondary.main}` : '1px solid #ccc',
                            borderRadius: '8px',
                            minWidth: '120px',
                            textAlign: 'center',
                            transition: 'background 0.3s, border 0.3s',
                        }}
                    >
                        {goal.text} {/* Display the text */}
                    </Paper>
                ))}
            </Box>
            <Button
                onClick={handleSubmit}
                disabled={!selectedGoalId}
                fullWidth
                sx={{ mt: 2 }}
            >
                Next
            </Button>
        </Box>
    );
};

export default GoalStep;
