/**
 * Компонент `InputText` — настраиваемый текстовый инпут, основанный на компоненте `TextField` из Material-UI.
 * Этот компонент поддерживает различные параметры, включая ширину, метку и обработчик изменений.
 *
 * Свойства:
 * - `width` (необязательный): ширина текстового поля в виде строки. Значение по умолчанию — "30%".
 * - `label` (необязательный): текст метки, который будет отображен в текстовом поле.
 * - `onChange` (необязательный): функция-обработчик для события изменения текста. 
 * - `id` (необязательный): уникальный идентификатор для текстового поля, передается через интерфейс `IdProps`.
 *
 * Пример использования:
 * ```typescript
 * <InputText
 *    width="50%"
 *    label="Введите текст"
 *    onChange={(event) => console.log(event.target.value)}
 * />
 * ```
 */

import React from 'react';
import { styled } from '@mui/material';
import { TextField } from '@mui/material';
import IdProps from './IdProps';

// Интерфейс для свойств компонента InputText
interface InputTextProps extends IdProps {
    width?: string;
    label?: string;
    type?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Стилизация текстового поля с использованием styled API Material-UI
const CustomInput = styled(TextField)<InputTextProps>(({ width, theme }) => ({
    borderRadius: '0px',
    width: width || "30%", // Ширина по умолчанию 30%, если не указано значение в props
    backgroundColor: theme.palette.secondary.light, // Задний фон с использованием палитры темы
}));

// Компонент InputText
const InputText: React.FC<InputTextProps> = ({ ...props }) => {
    return (
        <CustomInput variant="filled" {...props} />
    );
};

export default InputText;
