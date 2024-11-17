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
import { Box, Button, Dialog, DialogContent, DialogActions, Typography, Slider, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface SliderCategory {
    type: 'slider';
    label: string;
    min: number;
    max: number;
}

interface SelectCategory {
    type: 'select';
    label: string;
    options: string[];
}

interface ButtonSelectCategory {
    type: 'buttonSelect';
    label: string;
    options: string[];
}

interface LanguageSelectCategory {
    type: 'languageSelect';
    label: string;
}

type Category = SliderCategory | SelectCategory | ButtonSelectCategory | LanguageSelectCategory;

interface DynamicCategoryDialogProps {
    open: boolean;
    category: Category;
    onClose: () => void;
    onSave: (value: string | number | string[] | null) => void;
}

const DynamicCategoryDialog: React.FC<DynamicCategoryDialogProps> = ({ open, category, onClose, onSave }) => {
    const [value, setValue] = useState<string | number | string[] | null>(null);

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
                        <Typography>{`${category.label}: ${value ?? category.min}`}</Typography>
                        <Slider
                            value={typeof value === 'number' ? value : category.min}
                            min={category.min}
                            max={category.max}
                            onChange={(e, newValue) => setValue(newValue as number)}
                        />
                    </Box>
                );
            case 'select':
                return (
                    <Box>
                        <Typography>{category.label}</Typography>
                        <select onChange={(e) => setValue(e.target.value)} value={value ?? ''}>
                            {category.options.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </Box>
                );
            case 'buttonSelect':
                return (
                    <Box>
                        <Typography>{category.label}</Typography>
                        {category.options.map((option, index) => (
                            <Button
                                key={index}
                                variant={value === option ? 'contained' : 'outlined'}
                                onClick={() => setValue(option)}
                            >
                                {option}
                            </Button>
                        ))}
                    </Box>
                );
            case 'languageSelect':
                return (
                    <Box>
                        <Typography>{category.label}</Typography>
                        <Button onClick={() => setValue((prev) => (prev ? [...(prev as string[]), ''] : ['']))}>
                            Добавить язык
                        </Button>
                        {(value as string[] | null)?.map((lang, index) => (
                            <Box key={index} display="flex" alignItems="center">
                                <input
                                    type="text"
                                    value={lang}
                                    onChange={(e) => {
                                        const newValue = [...(value as string[])];
                                        newValue[index] = e.target.value;
                                        setValue(newValue);
                                    }}
                                />
                                <IconButton data-testid={`delete-button-${index}`} onClick={() => {
                                    const newValue = [...(value as string[])];
                                    newValue.splice(index, 1);
                                    setValue(newValue);
                                }}>
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
            <DialogContent>{renderContent()}</DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleSave}>Сохранить</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DynamicCategoryDialog;