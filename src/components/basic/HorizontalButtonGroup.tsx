<<<<<<< HEAD
/**
 * Компонент `HorizontalButtonGroup` представляет группу горизонтально расположенных кнопок.
 * Каждая кнопка позволяет пользователю выбрать один из вариантов, переданных в `options`.
 * Выбранная кнопка меняет свой цвет, указывая, что она активна.
 * 
 * Свойства компонента:
 * - `options`: string[] — Массив строк с вариантами, которые будут отображаться на кнопках.
 * - `spacing`: number — Расстояние между кнопками в пикселях.
 * - `onButtonClick`: (option: string) => void — Функция-обработчик, вызываемая при клике на кнопку,
 *    передает в качестве аргумента выбранный вариант.
 * 
 * Внутреннее состояние:
 * - `selectedOption`: string | null — Состояние для хранения текущего выбранного варианта.
 * 
 * Пример использования:
 * 
 * ```typescript
 * <HorizontalButtonGroup
 *   options={['Option 1', 'Option 2', 'Option 3']}
 *   spacing={8}
 *   onButtonClick={(option) => console.log(`Выбрана опция: ${option}`)}
 * />
 * ```
 */

import React, { useState } from 'react';
import { Button, Box, styled } from '@mui/material';
import IdProps from './IdProps';
=======
import React, { useState } from 'react'; // Импортируем необходимые модули из React
import { Button, Box, styled } from '@mui/material'; // Импортируем компоненты Material UI
import IdProps from './IdProps'; // Импортируем интерфейс IdProps из другого файла
>>>>>>> 968d60fea55ab33f8efba8f7bc5fa5a8db67b66e

// Определяем интерфейс для свойств компонента HorizontalButtonGroupProps
interface HorizontalButtonGroupProps extends IdProps {
<<<<<<< HEAD
    options: string[];
    spacing: number;
    onButtonClick: (option: string) => void;
=======
    options: string[]; // Список вариантов, которые будут отображены в кнопках
    spacing: number; // Расстояние между кнопками в пикселях
    onButtonClick: (option: string) => void; // Функция для обработки клика по кнопке
>>>>>>> 968d60fea55ab33f8efba8f7bc5fa5a8db67b66e
}

// Создаем стилизованную кнопку с использованием Material UI
const CustomButton = styled(Button)<{ selected: boolean }>(({ selected, theme }) => ({
<<<<<<< HEAD
    borderRadius: '5px',
    backgroundColor: selected ? theme.palette.secondary.dark : theme.palette.secondary.light,
    color: selected ? theme.palette.secondary.contrastText : theme.palette.primary.main,
    '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
    },
}));

const HorizontalButtonGroup: React.FC<HorizontalButtonGroupProps> = ({ options, spacing, onButtonClick }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
=======
    borderRadius: '5px', // Скругленные углы кнопки
    backgroundColor: selected ? theme.palette.secondary.dark : theme.palette.secondary.light, // Цвет фона в зависимости от состояния selected
    color: selected ? theme.palette.secondary.contrastText : theme.palette.primary.main, // Цвет текста в зависимости от состояния selected
    '&:hover': {
        backgroundColor: theme.palette.secondary.dark, // Цвет фона при наведении
    },
}));

// Основной компонент HorizontalButtonGroup
export const HorizontalButtonGroup: React.FC<HorizontalButtonGroupProps> = ({ options, spacing, onButtonClick }) => {
    // Состояние для хранения выбранной опции, по умолчанию первая опция
    const [selectedOption, setSelectedOption] = useState<string | null>(options[0]);
>>>>>>> 968d60fea55ab33f8efba8f7bc5fa5a8db67b66e

    return (
        <Box display="flex" gap={`${spacing}px`}> {/* Используем Box для создания горизонтальной группы кнопок с заданным расстоянием между ними */}
            {options.map((option, index) => ( // Проходим по всем вариантам
                <CustomButton
<<<<<<< HEAD
                    key={index}
                    variant="contained"
                    selected={selectedOption === option}
                    onClick={() => {
                        onButtonClick(option);
                        setSelectedOption(option);
                    }}
                >
                    {option}
=======
                    key={index} // Уникальный ключ для каждой кнопки
                    variant="contained" // Стиль кнопки
                    selected={selectedOption === option} // Устанавливаем состояние selected в зависимости от выбранной опции
                    onClick={() => { // Обработчик клика по кнопке
                        onButtonClick(option); // Вызываем функцию обратного вызова с выбранной опцией
                        setSelectedOption(option); // Обновляем состояние выбранной опции
                    }}
                >
                    {option} {/* Отображаем текст опции на кнопке */}
>>>>>>> 968d60fea55ab33f8efba8f7bc5fa5a8db67b66e
                </CustomButton>
            ))}
        </Box>
    );
};

<<<<<<< HEAD
export default HorizontalButtonGroup;
=======
// Экспортируем компонент для использования в других частях приложения
export default HorizontalButtonGroup;
>>>>>>> 968d60fea55ab33f8efba8f7bc5fa5a8db67b66e
