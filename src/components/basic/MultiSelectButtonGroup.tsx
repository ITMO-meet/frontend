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
        </CustomButton>
      ))}
    </Box>
  );
};

export default MultiSelectButtonGroup;
