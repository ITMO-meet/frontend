// UsernameStep.tsx
import { Box, Typography, TextField, Button } from '@mui/material'; // Импортируем компоненты из MUI
import React, { useState } from 'react'; // Импортируем React и хук useState
import { selectUsername } from '../../api/register';
import { useError } from '../../contexts/ErrorContext';

// Определяем интерфейс для пропсов компонента
interface UsernameStepProps {
    isu: number;
    onNext: () => void;
}

// Основной компонент UsernameStep
const UsernameStep: React.FC<UsernameStepProps> = ({ isu, onNext }) => {
    const { showError } = useError();
    const [username, setUsername] = useState('');// Хук состояния для хранения введенного имени пользователя

    // Функция для обработки отправки данных
    const handleSubmit = async () => {
        if (!username.trim()) {
            showError('Please enter a username');
            return;
        }
        try {
            await selectUsername({ isu, username: username.trim() });
            onNext();
        } catch(e: any) {
            showError(e.message);
        }
    };

    return (
        <Box padding="20px">
            <Typography variant="h5" align="center" mb={2}>Choose a username</Typography>
            <TextField
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                label="Username"
                sx={{mb:2}}
            />
            <Button onClick={handleSubmit} disabled={!username.trim()} fullWidth>
                Next
            </Button>
        </Box>
    );
};

export default UsernameStep; // Экспортируем компонент для использования в других частях приложения
