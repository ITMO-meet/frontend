// TagsStep.tsx
import { Box, Typography } from '@mui/material'; // Импортируем компоненты из MUI
import React, { useState } from 'react'; // Импортируем React и хук useState
import MultiSelectButtonGroup from '../basic/MultiSelectButtonGroup'; // Импортируем компонент для выбора нескольких кнопок
import RoundButton from '../basic/RoundButton'; // Импортируем компонент круглой кнопки

// Определяем доступные теги для выбора
const tags = ['Спорт', 'Музыка', 'Путешествия', 'Чтение'];

// Определяем интерфейс для пропсов компонента
interface TagsStepProps {
  onNext: (data: { tags: string[] }) => void; // Функция, которая будет вызвана при переходе к следующему шагу с выбранными тегами
}

// Основной компонент TagsStep
const TagsStep: React.FC<TagsStepProps> = ({ onNext }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // Хук состояния для хранения выбранных тегов

  // Функция для обработки отправки данных
  const handleSubmit = () => {
    onNext({ tags: selectedTags }); // Вызываем функцию onNext с выбранными тегами
  };

  return (
    <Box style={{ padding: '20px' }}> {/* Обертка с отступами */}
      <Typography variant="h5" align='center' sx={{ marginBottom: "20px" }}>Main Interests</Typography> {/* Заголовок */}
      <MultiSelectButtonGroup 
        options={tags} // Передаем доступные теги в компонент выбора
        onClickOption={setSelectedTags} // Обновляем состояние при выборе тегов
      />
      <RoundButton 
        onClick={handleSubmit} // Обработчик клика по кнопке
        sx={{ width: "100%", marginTop: "20px" }} // Стили для кнопки
      >
        Next
      </RoundButton>
    </Box>
  );
};

export default TagsStep; // Экспортируем компонент для использования в других частях приложения
