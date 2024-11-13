<<<<<<< HEAD
/**
 * Компонент `MultiSelectButtonGroup` позволяет пользователю выбирать несколько опций из предложенного списка кнопок.
 * Каждая выбранная кнопка отмечается значком и изменяет свой стиль.
 * 
 * Параметры:
 * - `options` (string[]): Список строк, представляющих опции, которые могут быть выбраны.
 * - `onClickOption` (function): Функция, вызываемая при изменении выбора. Получает массив выбранных опций.
 * 
 * Внутреннее состояние:
 * - `selectedOptions` (string[]): Массив строк, представляющих текущий набор выбранных опций.
 * 
 * Использование:
 * Компонент отображает кнопки для каждой опции из `options`. 
 * При клике на кнопку происходит переключение её состояния — она становится выбранной, если была не выбрана, и наоборот.
 * Выбранные опции передаются через `onClickOption`, что позволяет управлять состоянием выбора из родительского компонента.
 */

import React, { useState } from 'react';
import { Button, Box, styled } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import IdProps from './IdProps';

// Интерфейс для параметров компонента
interface MultiSelectButtonsProps extends IdProps {
  options: string[];
  onClickOption: (selectedOpts: string[]) => void;
}

// Стилизация кнопок выбора
const CustomButton = styled(Button)<{ selected: boolean }>(({ selected, theme }) => ({
  borderRadius: '12px', // Округлённые края для мягкого стиля
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.grey[300]}`, // Цвет бордюра зависит от состояния
  backgroundColor: selected ? theme.palette.background.paper : 'transparent', // Фон кнопки меняется при выборе
  color: selected ? theme.palette.primary.dark : theme.palette.text.primary, // Цвет текста зависит от состояния выбора
  fontSize: '0.875rem',
  padding: '8px 16px',
  transition: 'padding 0.2s ease-in-out',
  display: 'flex',
  alignItems: 'center',
  '& .MuiButton-startIcon': {
    margin: 0, // Убираем отступ у иконки, чтобы центрировать её
  },
  '&:hover': {
    backgroundColor: selected ? theme.palette.action.hover : 'transparent',
  },
  textTransform: 'none',
}));

// Главный компонент группы мультивыбора
const MultiSelectButtonGroup: React.FC<MultiSelectButtonsProps> = ({ options, onClickOption }) => {
  // Хук для хранения текущего выбора
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Переключение состояния выбранной опции
  const handleToggle = (option: string) => {
    const newOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((o) => o !== option) // Убираем из выбора
      : [...selectedOptions, option]; // Добавляем в выбор
    onClickOption(newOptions); // Обновляем выбор в родительском компоненте
    setSelectedOptions(newOptions); // Обновляем локальное состояние
  };

  return (
    // Контейнер для кнопок
    <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
      {options.map((option) => (
        <CustomButton
          key={option} // Уникальный ключ для каждой кнопки
          variant="outlined" // Контурная кнопка по умолчанию
          selected={selectedOptions.includes(option)} // Зависимость цвета и стиля от состояния
          onClick={() => handleToggle(option)} // Обработка клика по кнопке
          startIcon={selectedOptions.includes(option) ? <CheckIcon fontSize="small" /> : null} // Иконка при выборе
        >
          {option} {/* Текст кнопки */}
=======
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
>>>>>>> 968d60fea55ab33f8efba8f7bc5fa5a8db67b66e
        </CustomButton>
      ))}
    </Box>
  );
};

<<<<<<< HEAD
=======
// Экспортируем компонент для использования в других частях приложения
>>>>>>> 968d60fea55ab33f8efba8f7bc5fa5a8db67b66e
export default MultiSelectButtonGroup;
