/**
 * Компонент `DynamicCategoryDialog` предоставляет диалоговое окно для выбора значений по определенной категории.
 * Поддерживаются разные типы категорий:
 * - `slider`: Отображает слайдер для выбора числового значения в заданном диапазоне.
 * - `select`: Отображает список опций для выбора одного значения.
 * - `buttonSelect`: Отображает опции в виде кнопок, позволяя выбрать одну из них.
 * - `languageSelect`: Предоставляет возможность добавлять и удалять языки из списка.
 *
 * Компонент принимает следующие свойства:
 * @prop {boolean} open - Управляет видимостью диалогового окна.
 * @prop {object} category - Объект, описывающий категорию и тип её выбора (например, `slider`, `select` и т.д.).
 * @prop {() => void} onClose - Функция, вызываемая при закрытии диалогового окна без сохранения.
 * @prop {(value: any) => void} onSave - Функция, вызываемая при сохранении выбранного значения.
 *
 * Пример использования:
 * ```typescript
 * <DynamicCategoryDialog
 *   open={isOpen}
 *   category={{ type: 'slider', label: 'Height', min: 100, max: 250 }}
 *   onClose={handleClose}
 *   onSave={handleSave}
 * />
 * ```
 */

import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogActions, Typography, Slider, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface DynamicCategoryDialogProps {
    open: boolean;
    category: any;
    onClose: () => void;
    onSave: (value: any) => void;
}

const DynamicCategoryDialog: React.FC<DynamicCategoryDialogProps> = ({ open, category, onClose, onSave }) => {
    const [value, setValue] = useState<any>(null);

    // Функция для сохранения выбранного значения и закрытия диалогового окна
    const handleSave = () => {
        onSave(value);
        onClose();
    };

    // Рендерит содержимое диалогового окна в зависимости от типа категории
    const renderContent = () => {
        switch (category.type) {
            case 'slider':
                return (
                    <Box>
                        <Typography>{category.label}: {value || category.min}</Typography>
                        <Slider
                            value={value || category.min}
                            min={category.min}
                            max={category.max}
                            onChange={(e, newValue) => setValue(newValue)}
                        />
                    </Box>
                );
            case 'select':
                return (
                    <Box>
                        {category.options.map((option: string, index: number) => (
                            <Box
                                key={index}
                                onClick={() => setValue(option)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    backgroundColor: value === option ? 'primary.main' : 'transparent',
                                    color: value === option ? 'white' : 'text.primary',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'grey.200'
                                    }
                                }}
                            >
                                <Typography>{option}</Typography>
                            </Box>
                        ))}
                    </Box>
                );
            case 'buttonSelect':
                return (
                    <Box>
                        {category.options.map((option: string, index: number) => (
                            <Button
                                key={index}
                                variant={value === option ? 'contained' : 'outlined'}
                                onClick={() => setValue(option)}
                                fullWidth
                                sx={{ mt: 1 }}
                            >
                                {option}
                            </Button>
                        ))}
                    </Box>
                );
            case 'languageSelect':
                return (
                    <Box>
                        <Button onClick={() => console.log('Add language dialog')}>Добавить язык</Button>
                        {value && value.map((lang: string, index: number) => (
                            <Box
                                key={index}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                p={1}
                                sx={{
                                    mt: 1,
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                            >
                                <Typography>{lang}</Typography>
                                <IconButton onClick={() => setValue(value.filter((l: string) => l !== lang))}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <Typography variant="h6">{category.label}</Typography>
                {renderContent()}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleSave} variant="contained">Сохранить</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DynamicCategoryDialog;
