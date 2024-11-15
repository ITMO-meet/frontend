import React, { useState } from 'react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import InputText from '../basic/InputText';
import RoundButton from '../basic/RoundButton';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = () => {
    if (userId.length !== 6) {
      makeAlert('ID must be exact 6 symbols');
      return;
    }

    if (password.trim() === '') {
      makeAlert('Password must not be empty');
      return;
    }
    // TODO: check if id + password correct
    // TODO: check if user should complete registration

    navigate("/chats");
  };

  const makeAlert = (message: string) => {
    setAlertMessage(message);
    setOpenSnackbar(true);
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        height: "95hv",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: '200px' }}>
        Login with ITMO.ID
      </Typography>
      <InputText width='80%' label='ID' onChange={(e) => setUserId(e.target.value)} sx={{ marginBottom: '20px' }} />
      <InputText width="80%" label="Password" onChange={(e) => setPassword(e.target.value)} type="password" sx={{ marginBottom: '20px' }} />
      <RoundButton onClick={handleSubmit}>Continue</RoundButton>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;