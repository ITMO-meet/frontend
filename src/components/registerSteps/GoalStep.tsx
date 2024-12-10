// GoalStep.tsx
import { Box, Typography, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { selectRelationship, fetchPreferences } from '../../api/register';
import { useError } from '../../contexts/ErrorContext';

interface GoalStepProps {
    isu: number;
    onNext: () => void;
}

const GoalStep: React.FC<GoalStepProps> = ({ isu, onNext }) => {
    const { showError } = useError();
    const [allGoals, setAllGoals] = useState<string[]>([]);
    const [goal, setGoal] = useState('');

    useEffect(() => {
        fetchPreferences().then(setAllGoals).catch(err => showError(err.message));
    }, [showError]);

    const handleSubmit = async () => {
        if (!goal) {
            showError('Please select your relationship preference');
            return;
        }
        try {
            await selectRelationship({ isu, relationship_preference: [goal] });
            onNext();
        } catch(e: any) {
            showError(e.message);
        }
    };

    return (
        <Box padding="20px">
            <Typography variant="h5" align="center" mb={2}>What are you looking for?</Typography>
            <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
                {allGoals.map(g => (
                    <Button
                        key={g}
                        variant={g === goal ? 'contained' : 'outlined'}
                        onClick={() => setGoal(g)}
                    >
                        {g}
                    </Button>
                ))}
            </Box>
            <Button onClick={handleSubmit} disabled={!goal} fullWidth sx={{mt:2}}>
                Next
            </Button>
        </Box>
    );
};

export default GoalStep;
