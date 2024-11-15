// GenderStep.tsx
import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import HorizontalButtonGroup from '../basic/HorizontalButtonGroup';
import RoundButton from '../basic/RoundButton';

interface GenderStepProps {
  onNext: (data: { gender: string }) => void;
}

const options = ["Male", "Female", "Everyone"]

const GenderStep: React.FC<GenderStepProps> = ({ onNext }) => {
  const [gender, setGender] = useState('');

  const handleSubmit = () => {
    onNext({ gender });
  };

  return (
    <Box style={{ padding: '20px' }}>
      <Typography variant="h5" align='center' sx={{ marginBottom: "20px" }}>Dating Settings</Typography>
      <Typography variant="h6" align='center'>Show me</Typography>
      <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
        <HorizontalButtonGroup onButtonClick={(option) => setGender(option)} spacing={10} options={options} />
      </Box>
      <RoundButton onClick={handleSubmit} disabled={gender === ''} sx={{ width: "100%" }}>Next</RoundButton>
    </Box>
  );
};

export default GenderStep;
