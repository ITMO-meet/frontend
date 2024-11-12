import React, { useState } from 'react'; // Импортируем необходимые модули из React
import { Button, Box, styled } from '@mui/material'; // Импортируем компоненты Material UI
import IdProps from './IdProps'; // Импортируем интерфейс IdProps из другого файла

// Определяем интерфейс для свойств компонента HorizontalButtonGroupProps
interface HorizontalButtonGroupProps extends IdProps {
    options: string[]; // Список вариантов, которые будут отображены в кнопках
    spacing: number; // Расстояние между кнопками в пикселях
    onButtonClick: (option: string) => void; // Функция для обработки клика по кнопке
}

// Создаем стилизованную кнопку с использованием Material UI
const CustomButton = styled(Button)<{ selected: boolean }>(({ selected, theme }) => ({
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

    return (
        <Box display="flex" gap={`${spacing}px`}> {/* Используем Box для создания горизонтальной группы кнопок с заданным расстоянием между ними */}
            {options.map((option, index) => ( // Проходим по всем вариантам
                <CustomButton
                    key={index} // Уникальный ключ для каждой кнопки
                    variant="contained" // Стиль кнопки
                    selected={selectedOption === option} // Устанавливаем состояние selected в зависимости от выбранной опции
                    onClick={() => { // Обработчик клика по кнопке
                        onButtonClick(option); // Вызываем функцию обратного вызова с выбранной опцией
                        setSelectedOption(option); // Обновляем состояние выбранной опции
                    }}
                >
                    {option} {/* Отображаем текст опции на кнопке */}
                </CustomButton>
            ))}
        </Box>
    );
};

// Экспортируем компонент для использования в других частях приложения
export default HorizontalButtonGroup;