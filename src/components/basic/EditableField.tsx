/**
 * Компонент `EditableField` представляет собой редактируемое текстовое поле с возможностью открытия
 * модального окна (Bottom Sheet) для редактирования значения.
 * 
 * Основные функциональные возможности:
 * - Отображает заданную метку (`label`) и начальное значение (`initialValue`).
 * - При клике по полю открывается модальное окно (Bottom Sheet) с текстовым полем для редактирования значения.
 * - Модальное окно включает кнопки "Сохранить" и "Отмена".
 *   - "Сохранить" применяет введенное значение к основному полю.
 *   - "Отмена" закрывает модальное окно без сохранения изменений.
 * 
 * Параметры:
 * - `label` (string): Заголовок поля.
 * - `initialValue` (string): Начальное значение, которое будет отображаться в текстовом поле.
 * 
 * Пример использования:
 * ```typescript
 * <EditableField label="Bio" initialValue="Опишите себя..." />
 * ```
 */

import React, { useState } from 'react';
import { Box, Typography, Dialog, DialogContent, DialogActions, Button, TextField } from '@mui/material';

interface EditableFieldProps {
    label: string;
    initialValue: string;
    onSave?: (value: string) => void
}

const EditableField: React.FC<EditableFieldProps> = ({ label, initialValue, onSave }) => {
    const [value, setValue] = useState(initialValue); // Основное значение, которое отображается в поле
    const [tempValue, setTempValue] = useState(initialValue); // Временное значение для модального окна
    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false); // Состояние для управления видимостью модального окна

    // Открытие модального окна с установкой временного значения
    const openBottomSheet = () => {
        setTempValue(value);
        setBottomSheetOpen(true);
    };

    // Закрытие модального окна без сохранения
    const closeBottomSheet = () => {
        setBottomSheetOpen(false);
    };

    // Сохранение временного значения в основное и закрытие модального окна
    const handleSave = () => {
        setValue(tempValue);
        if (onSave) onSave(tempValue);
        closeBottomSheet();
    };

    return (
        <Box width="100%" mt={2}>
            {/* Метка поля */}
            <Typography variant="h6" onClick={openBottomSheet} sx={{ fontWeight: 'bold', mb: 1 }}>
                {label}
            </Typography>

            {/* Область отображения текущего значения */}
            <Box 
                display="flex" 
                flexDirection="column" 
                gap={1} 
                border="1px solid #ccc" 
                p={1} 
                borderRadius="4px" 
                onClick={openBottomSheet} 
                sx={{ cursor: 'pointer' }}
            >
                <Typography variant="body2">{value}</Typography>
            </Box>

            {/* Модальное окно для редактирования значения */}
            <Dialog
                open={isBottomSheetOpen}
                onClose={closeBottomSheet}
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: '16px 16px 0 0',
                        position: 'fixed',
                        bottom: 0,
                        width: '100%',
                        m: 0
                    }
                }}
            >
                <DialogContent>
                    {/* Текстовое поле для редактирования значения */}
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        placeholder={`Edit your ${label.toLowerCase()}...`}
                    />
                </DialogContent>
                <DialogActions>
                    {/* Кнопки "Отмена" и "Сохранить" */}
                    <Button onClick={closeBottomSheet}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EditableField;
