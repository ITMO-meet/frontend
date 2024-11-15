// UsernameStep.tsx
import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import InputText from '../basic/InputText';
import RoundButton from '../basic/RoundButton';

interface UsernameStepProps {
  onNext: (data: { username: string }) => void;
}

const UsernameStep: React.FC<UsernameStepProps> = ({ onNext }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    onNext({ username });
  };

  return (
    <Box style={{ padding: '20px' }}>
      <Typography variant="h5" align='center'>Enter your username</Typography>
      <InputText label="Username" onChange={(e) => setUsername(e.target.value)} sx={{ width: "100%", marginY: "20px" }} />
      <RoundButton disabled={username===""} onClick={handleSubmit} sx={{ width: "100%" }}>Next</RoundButton>
    </Box>
  );
};

export default UsernameStep;
