import { Box, TextField, Typography } from '@mui/material'; // Импортируем компоненты из MUI
import React, { useState } from 'react'; // Импортируем React и хук useState
import RoundButton from '../basic/RoundButton'; // Импортируем компонент круглой кнопки
import { useError } from '../../contexts/ErrorContext';

// Определяем интерфейс для пропсов компонента
interface BioStepProps {
    onNext: (data: { bio: string }) => void; // Функция, которая будет вызвана при переходе к следующему шагу
}

// Основной компонент UsernameStep
const BioStep: React.FC<BioStepProps> = ({ onNext }) => {
    const { showError } = useError();
    const [bio, setBio] = useState(''); // Хук состояния для хранения введенного описания

    // Функция для обработки отправки данных
    const handleSubmit = async () => {
        if (!bio.trim()) {
            showError('Please provide short bio');
            return;
        }
        onNext({ bio: bio.trim() });
    };

    return (
        <Box style={{ padding: '20px' }}> {/* Обертка с отступами */}
            <Typography variant="h5" align='center'>Enter information about yourself</Typography> {/* Заголовок */}
            {/* Текстовое поле для редактирования значения */}
            <TextField
                fullWidth
                multiline
                minRows={3}
                onChange={(e) => setBio(e.target.value)}
                placeholder={'Edit your bio...'}
                sx={{ marginY: "20px" }}
            />
            <RoundButton
                disabled={bio === ""} // Кнопка отключена, если описание пустое
                onClick={handleSubmit} // Обработчик клика по кнопке
                sx={{ width: "100%" }} // Стили для кнопки
            >
                Next
            </RoundButton>
        </Box>
    );
};

export default BioStep; // Экспортируем компонент для использования в других частях приложения
