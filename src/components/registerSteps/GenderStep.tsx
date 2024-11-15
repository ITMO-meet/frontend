// GenderStep.tsx
import { Box, Typography } from '@mui/material'; // Импортируем необходимые компоненты из MUI
import React, { useState } from 'react'; // Импортируем React и хук useState
import HorizontalButtonGroup from '../basic/HorizontalButtonGroup'; // Импортируем компонент для группировки кнопок
import RoundButton from '../basic/RoundButton'; // Импортируем компонент круглой кнопки

// Определяем доступные варианты выбора пола
const options = ["Male", "Female", "Everyone"];

// Определяем интерфейс для пропсов компонента
interface GenderStepProps {
  onNext: (data: { gender: string }) => void; // Функция, которая будет вызвана при выборе пола
}

// Основной компонент GenderStep
const GenderStep: React.FC<GenderStepProps> = ({ onNext }) => {
  const [gender, setGender] = useState(''); // Хук состояния для хранения выбранного пола

  // Функция для обработки отправки данных
  const handleSubmit = () => {
    onNext({ gender }); // Вызываем функцию onNext с выбранным полом
  };

  return (
    <Box style={{ padding: '20px' }}> {/* Обертка с отступами */}
      <Typography variant="h5" align='center' sx={{ marginBottom: "20px" }}>Dating Settings</Typography> {/* Заголовок */}
      <Typography variant="h6" align='center'>Show me</Typography> {/* Подзаголовок с инструкцией */}
      <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}> {/* Центрируем группу кнопок */}
        <HorizontalButtonGroup 
          onButtonClick={(option) => setGender(option)} // Обработчик клика по кнопке для установки пола
          spacing={10} // Промежуток между кнопками
          options={options} // Передаем доступные варианты
        />
      </Box>
      <RoundButton 
        onClick={handleSubmit} // Обработчик клика по кнопке
        disabled={gender === ''} // Кнопка отключена, если пол не выбран
        sx={{ width: "100%" }} // Стили для кнопки
      >
        Next
      </RoundButton>
    </Box>
  );
};

export default GenderStep; // Экспортируем компонент для использования в других частях приложения
