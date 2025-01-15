import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import InputText from '../basic/InputText';
import RoundButton from '../basic/RoundButton';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import { useError } from '../../contexts/ErrorContext';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { showError } = useError();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        if (userId.length !== 6) {
            showError('ID must be exactly 6 symbols');
            return;
        }

        if (password.trim() === '') {
            showError('Password must not be empty');
            return;
        }

        const { redirectUrl, isu } = await loginUser(userId, password);

        localStorage.setItem('isu', isu.toString());

        if (redirectUrl.endsWith('/auth/dashboard')) {
            navigate("/chats");
        } else if (redirectUrl.endsWith('/auth/register/select_username')) {
            navigate("/register");
        } else {
            showError('Unexpected redirect from server');
        }
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
            <Typography
                variant="h4"
                sx={{
                    marginBottom: '200px',
                    color: '#4a4a4a', // Тёмно-серый цвет заголовка
                    fontFamily: "'Poppins', Arial, sans-serif",
                    fontWeight: 600,
                }}
            >
                Login with ITMO.ID
            </Typography>
            <InputText
                width="80%"
                label="ID"
                onChange={(e) => setUserId(e.target.value)}
                sx={{
                    marginBottom: '20px',
                    fontFamily: "'Poppins', Arial, sans-serif",
                }}
            />
            <InputText
                width="80%"
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                sx={{
                    marginBottom: '20px',
                    fontFamily: "'Poppins', Arial, sans-serif",
                }}
            />
            <RoundButton
                onClick={handleSubmit}
                sx={{
                    fontSize: '1.1rem', // Увеличенный размер текста
                    fontWeight: 700, // Жирный текст
                    fontFamily: "'Poppins', Arial, sans-serif",
                    letterSpacing: '0.05em', // Расширение текста
                    padding: '10px 20px', // Увеличенный внутренний отступ
                }}
            >
                Continue
            </RoundButton>

        </Box>
    );
};

export default LoginPage;
