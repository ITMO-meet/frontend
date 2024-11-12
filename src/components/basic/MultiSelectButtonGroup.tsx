import React, { useState } from 'react'; // Импортируем необходимые модули из React
import { Button, ButtonGroup, styled } from '@mui/material'; // Импортируем компоненты Material UI
import CheckIcon from '@mui/icons-material/Check'; // Импортируем иконку Check из Material UI
import IdProps from './IdProps'; // Импортируем интерфейс IdProps из другого файла

// Определяем интерфейс для свойств компонента MultiSelectButtonsProps
interface MultiSelectButtonsProps extends IdProps {
  options: string[], // Массив строк, представляющий доступные варианты
  onClickOption: (selectedOpts: string[]) => void // Функция обратного вызова, которая принимает выбранные опции
}

// Создаем стилизованную кнопку с использованием Material UI
const CustomButton = styled(Button)<{ selected: boolean }>(({ selected, theme }) => ({
  borderRadius: '5px', // Скругленные углы кнопки
  backgroundColor: selected ? theme.palette.secondary.dark : theme.palette.secondary.light, // Цвет фона в зависимости от состояния selected
  color: selected ? theme.palette.secondary.contrastText : theme.palette.primary.main, // Цвет текста в зависимости от состояния selected
  '&:hover': { backgroundColor: theme.palette.secondary.dark }, // Цвет фона при наведении
}));

// Основной компонент MultiSelectButtonGroup
export const MultiSelectButtonGroup: React.FC<MultiSelectButtonsProps> = ({ ...props }) => {
  // Состояние для хранения выбранных опций
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Функция для обработки переключения опции
  const handleToggle = (option: string) => {
    // Проверяем, выбрана ли опция
    const newOptions = selectedOptions.includes(option) 
      ? selectedOptions.filter((o) => o !== option) // Если выбрана, удаляем из выбранных
      : [...selectedOptions, option]; // Если не выбрана, добавляем в выбранные

    // Вызываем функцию обратного вызова с новыми выбранными опциями
    props.onClickOption(newOptions);
    // Обновляем состояние выбранных опций
    setSelectedOptions(newOptions);
  };

  return (
    <ButtonGroup> {/* Группа кнопок для выбора */}
      {props.options.map((option) => ( // Проходим по всем вариантам
        <CustomButton
          key={option} // Уникальный ключ для каждой кнопки
          variant="contained" // Стиль кнопки
          selected={selectedOptions.includes(option)} // Устанавливаем состояние selected
          onClick={() => {handleToggle(option)}} // Обработчик клика
          startIcon={selectedOptions.includes(option) ? <CheckIcon /> : null} // Иконка, если опция выбрана
        >
          {option} {/* Отображаем текст опции */}
        </CustomButton>
      ))}
    </ButtonGroup>
  );
};

// Экспортируем компонент для использования в других частях приложения
export default MultiSelectButtonGroup;
