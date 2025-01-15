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
            showError('Предоставьте краткую информацию о себе');
            return;
        }
        onNext({ bio: bio.trim() });
    };

    return (
        <Box style={{ padding: '20px' }}> {/* Обертка с отступами */}
            <Typography variant="h5" align='center'>Предоставьте краткую информацию о себе</Typography> {/* Заголовок */}
            {/* Текстовое поле для редактирования значения */}
            <TextField
                fullWidth
                multiline
                minRows={3}
                onChange={(e) => setBio(e.target.value)}
                placeholder={'Введите текст...'}
                sx={{ marginY: "20px" }}
            />
            <RoundButton
                disabled={bio === ""} // Кнопка отключена, если описание пустое
                onClick={handleSubmit} // Обработчик клика по кнопке
                sx={{ width: "100%" }} // Стили для кнопки
            >
                Продолжить
            </RoundButton>
        </Box>
    );
};

export default BioStep; // Экспортируем компонент для использования в других частях приложения
