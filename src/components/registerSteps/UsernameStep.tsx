// UsernameStep.tsx
import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { selectUsername } from '../../api/register';
import { useError } from '../../contexts/ErrorContext';
import RoundButton from "../basic/RoundButton";
import InputText from "../basic/InputText";

interface UsernameStepProps {
    isu: number;
    onNext: (data: { username: string }) => void;  // match test
}

const UsernameStep: React.FC<UsernameStepProps> = ({ isu, onNext }) => {
    const { showError } = useError();
    const [username, setUsername] = useState('');

    const handleSubmit = async () => {
        if (!username.trim()) {
            showError('Please enter a username');
            return;
        }
        try {
            await selectUsername({ isu, username: username.trim() });
            // Pass the object so the test can verify
            onNext({ username: username.trim() });
            /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch(e: any) {
            showError(e.message);
        }
    };

    return (
        <Box padding="20px">
            <Typography variant="h5" align="center" mb={2}>Choose a username</Typography>
            <InputText
                label="Username"
                onChange={(e) => setUsername(e.target.value)} // Обновляем состояние при изменении текста
                sx={{ width: "100%", marginY: "20px" }} // Стили для компонента ввода
            />
            <RoundButton
                disabled={username === ""} // Кнопка отключена, если имя пользователя пустое
                onClick={handleSubmit} // Обработчик клика по кнопке
                sx={{ width: "100%" }} // Стили для кнопки
            >
                Next
            </RoundButton>
        </Box>
    );
};

export default UsernameStep;
