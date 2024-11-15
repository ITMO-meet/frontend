import React from 'react';
import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import RoundButton from '../basic/RoundButton';
import theme from '../theme';

const goals = [
  { id: 1, title: 'Знакомства', description: 'Найти новых друзей и знакомых.' },
  { id: 2, title: 'Отношения', description: 'Построить романтические отношения.' },
  { id: 3, title: 'Дружба', description: 'Найти верных друзей.' },
  { id: 4, title: 'Общение', description: 'Улучшить навыки общения.' },
];

interface GoalStepProps {
  onNext: (data: { goal: string }) => void;
}

const GoalStep: React.FC<GoalStepProps> = ({ onNext }) => {
  const [selectedGoal, setSelectedGoal] = React.useState<number | null>(null);

  const handleGoalSelect = (goalId: number) => {
    setSelectedGoal(goalId);
  };

  const handleSubmit = () => {
    if (selectedGoal !== null) {
      const selectedGoalData = goals.find(goal => goal.id === selectedGoal);
      if (selectedGoalData) {
        onNext({ goal: selectedGoalData.title });
      }
    }
  };

  return (
    <Box style={{ padding: '20px' }}>
      <Typography variant="h5" align='center' sx={{ marginBottom: "20px" }}>What are you looking for?</Typography>
      <Typography variant="h6" align='center' sx={{ marginBottom: "20px" }}>It can be changed at any time</Typography>
      {goals.map(({ id, title, description }) => (
        <Card
          key={id}
          onClick={() => handleGoalSelect(id)}
          style={{
            margin: '10px 0',
            cursor: 'pointer',
            background: selectedGoal === id ? theme.palette.secondary.light : "white",
          }}
        >
          <CardContent>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2" color="textSecondary">
              {description}
            </Typography>
          </CardContent>
        </Card>
      ))}
      <RoundButton disabled={selectedGoal === null} onClick={handleSubmit} sx={{ width: "100%", marginTop: "20px" }}>Next</RoundButton>
    </Box>
  );
};

export default GoalStep;
