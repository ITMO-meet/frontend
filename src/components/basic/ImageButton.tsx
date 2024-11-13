/**
 * Компонент `ImageButton` — это кнопка с возможностью задать радиус и вложенные элементы, 
 * например, иконку или текст. Этот компонент стилизован для круглой формы и использует 
 * цветовую палитру темы Material-UI.
 * 
 * Параметры:
 * - `radius` (необязательный) — радиус кнопки. Если не задан, используется значение по умолчанию "56px".
 * - `children` (необязательный) — вложенные элементы внутри кнопки, обычно это иконка.
 * - `onClick` (необязательный) — функция-обработчик события нажатия на кнопку.
 * - `id` (от `IdProps`) — уникальный идентификатор компонента, если требуется.
 * 
 * Пример использования:
 * ```
 * <ImageButton radius="40px" onClick={handleClick}>
 *     <SomeIcon />
 * </ImageButton>
 * ```
 */

import { IconButton, styled } from "@mui/material";
import React from 'react';
import IdProps from "./IdProps";

// Определение интерфейса пропсов для ImageButton
interface ImageButtonProps extends IdProps {
<<<<<<< HEAD
    radius?: string;                 // Радиус кнопки, необязательный параметр, по умолчанию "56px"
    children?: React.ReactNode;       // Вложенные элементы, например, иконка
    onClick?: () => void;             // Функция-обработчик клика, необязательная
=======
    radius?: string, // Радиус кнопки
    children?: React.ReactNode, // Вложенный элемент
    onClick?: () => void // Действие по клику
>>>>>>> 968d60fea55ab33f8efba8f7bc5fa5a8db67b66e
}

// Стилизация кнопки с использованием Material-UI styled API
const CustomButton = styled(IconButton)<ImageButtonProps>(({ radius, theme }) => ({
    borderRadius: "100%",                               // Круглая форма кнопки
    width: radius || "56px",                            // Установка ширины по значению радиуса или значению по умолчанию
    height: radius || "56px",                           // Установка высоты по значению радиуса или значению по умолчанию
    backgroundColor: theme.palette.secondary.light,     // Фоновый цвет из палитры темы
    color: theme.palette.secondary.main                 // Цвет текста или иконки из палитры темы
}));

<<<<<<< HEAD
// Основной компонент, возвращающий стилизованную кнопку
const ImageButton: React.FC<ImageButtonProps> = ({ ...props }) => {
=======
export const ImageButton: React.FC<ImageButtonProps> = ({ ...props }) => {
>>>>>>> 968d60fea55ab33f8efba8f7bc5fa5a8db67b66e
    return (
        <CustomButton {...props} />
    );
};

export default ImageButton;
