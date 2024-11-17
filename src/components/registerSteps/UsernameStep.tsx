// UsernameStep.tsx
import { Box, Typography } from '@mui/material'; // Импортируем компоненты из MUI
import React, { useState } from 'react'; // Импортируем React и хук useState
import InputText from '../basic/InputText'; // Импортируем компонент для ввода текста
import RoundButton from '../basic/RoundButton'; // Импортируем компонент круглой кнопки

// Определяем интерфейс для пропсов компонента
interface UsernameStepProps {
  onNext: (data: { username: string }) => void; // Функция, которая будет вызвана при переходе к следующему шагу
}

// Основной компонент UsernameStep
const UsernameStep: React.FC<UsernameStepProps> = ({ onNext }) => {
  const [username, setUsername] = useState(''); // Хук состояния для хранения введенного имени пользователя

  // Функция для обработки отправки данных
  const handleSubmit = () => {
    onNext({ username }); // Вызываем функцию onNext с введенным именем пользователя
  };

  return (
    <Box style={{ padding: '20px' }}> {/* Обертка с отступами */}
      <Typography variant="h5" align='center'>Enter your username</Typography> {/* Заголовок */}
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

export default UsernameStep; // Экспортируем компонент для использования в других частях приложения
