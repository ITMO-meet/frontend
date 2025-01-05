/**
 * MultiCategorySheetButton.tsx
 * 
 * Компонент `MultiCategorySheetButton` предоставляет кнопку для открытия BottomSheet (нижнего модального окна),
 * позволяя пользователю выбрать значение для различных категорий в разделе `Main Features`. 
 * В зависимости от типа категории, могут быть доступны следующие формы ввода: слайдер, выбор из кнопок, 
 * поиск и мультивыбор языков.
 * 
 * Основные свойства:
 * - `label`: отображаемый текст до выбора значения.
 * - `category`: объект категории, описывающий тип ввода и возможные значения.
 * - `onSave`: функция, вызываемая при сохранении выбранного значения; принимает название категории и выбранное значение.
 */

import React, { useState } from 'react';
import { Box, Button, Typography, Dialog, DialogContent, DialogActions, Slider, TextField, styled, Grid } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MultiSelectButtonGroup from './MultiSelectButtonGroup';

interface SliderCategoryOption {
    label: string;
    type: 'slider';
    onConfirm?: (v: number) => void;
    selectedValue?: number | null;
    min: number;
    max: number;
}

interface SelectCategoryOption {
    label: string;
    type: 'select';
    selectedValue?: string | null;
    onConfirm?: (v: string) => void;
    options: string[];
}

interface ButtonSelectCategoryOption {
    label: string;
    type: 'buttonSelect';
    selectedValue?: string | null;
    onConfirm?: (v: string) => void;
    options: string[];
}

interface LanguageSelectCategoryOption {
    label: string;
    type: 'languageSelect';
    selectedValue?: string[] | null;
    onConfirm?: (v: string[]) => void;
}

export type CategoryOption = SliderCategoryOption | SelectCategoryOption | ButtonSelectCategoryOption | LanguageSelectCategoryOption;

interface MultiCategorySheetButtonProps {
    label: string;
    category: CategoryOption;
    onSave: (selectedCategory: string, selectedOption: string | string[]) => void;
}

// Настройки стиля для кнопки
const CustomButton = styled(Button)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#fff',
    width: '100%',
    textTransform: 'none',
});

// Список языков для поиска
const languageList = [
    'English', 'Russian', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Italian', 'Portuguese', 'Arabic',
    'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Turkish', 'Hebrew', 'Polish', 'Czech', 'Greek', 'Hindi'
];

const MultiCategorySheetButton: React.FC<MultiCategorySheetButtonProps> = ({ label, category, onSave }) => {
    // Управление состоянием BottomSheet
    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    // Значение, выбранное пользователем, для сохранения
    const [selectedOption, setSelectedOption] = useState<string | number | string[] | null | undefined>(category.selectedValue);
    // Значение для фильтрации списка языков
    const [searchTerm, setSearchTerm] = useState('');
    // Отфильтрованный список языков, отображаемый в поле поиска
    const [filteredLanguages, setFilteredLanguages] = useState<string[]>(languageList);

    const openBottomSheet = () => setBottomSheetOpen(true);
    const closeBottomSheet = () => setBottomSheetOpen(false);

    // Сохранение выбранного значения и закрытие BottomSheet
    const handleSave = () => {
        if (category.onConfirm && selectedOption) {
            if (category.type === "slider") {
                category.onConfirm(selectedOption as number)
            } else if (category.type === "select" || category.type === "buttonSelect") {
                category.onConfirm(selectedOption as string)
            } else if (category.type === "languageSelect") {
                category.onConfirm(selectedOption as string[])
            }
        } 

        if (selectedOption) {
            onSave(category.label, selectedOption as string | string[]);
        }
        closeBottomSheet();
    };

    // Обработка поиска для фильтрации языков по введенному тексту
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);
        setFilteredLanguages(
            languageList.filter(lang => lang.toLowerCase().includes(term.toLowerCase()))
        );
    };

    // Обновление списка выбранных языков для мультивыбора
    const handleLanguageSelection = (selectedLanguages: string[]) => {
        setSelectedOption(selectedLanguages);
    };

    return (
        <>
            {/* Основная кнопка, отображающая выбранное значение и открывающая BottomSheet */}
            <CustomButton name={`Choose ${category.label}`} onClick={openBottomSheet}>
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'black' }}>{category.label}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {Array.isArray(selectedOption) ? selectedOption.join(', ') : selectedOption || label}
                    </Typography>
                </Box>
                <ArrowForwardIosIcon fontSize="small" color="action" />
            </CustomButton>

            {/* BottomSheet для ввода значения, отображается в зависимости от типа категории */}
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
                    <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>{category.label}</Typography>
                    <Box mt={2}>
                        {/* Рендер слайдера для категорий с типом "slider" */}
                        {category.type === 'slider' && (
                            <>
                                <Typography variant="subtitle1" align="center" sx={{ mb: 1 }}>
                                    {selectedOption} cm
                                </Typography>
                                <Slider
                                    min={category.min}
                                    max={category.max}
                                    value={typeof selectedOption === 'number' ? selectedOption : category.min}
                                    onChange={(e, newValue) => setSelectedOption(newValue as number)}
                                />
                            </>
                        )}

                        {/* Рендер списка кнопок для категорий с типами "select" и "buttonSelect" */}
                        {(category.type === 'select' || category.type === 'buttonSelect') && (
                            <Grid container spacing={2} justifyContent="center">
                                {category.options.map((option, index) => (
                                    <Grid item xs={category.options.length === 3 ? 4 : 6} key={index}>
                                        <Button
                                            fullWidth
                                            variant={selectedOption === option ? "contained" : "outlined"}
                                            onClick={() => setSelectedOption(option)}
                                            sx={{ m: 0.5 }}
                                        >
                                            {option}
                                        </Button>
                                    </Grid>
                                ))}
                            </Grid>
                        )}

                        {/* Рендер поля поиска и мультивыбора для категорий с типом "languageSelect" */}
                        {category.type === 'languageSelect' && (
                            <Box>
                                <TextField
                                    placeholder="Search language"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                <MultiSelectButtonGroup
                                    options={filteredLanguages}
                                    onClickOption={handleLanguageSelection}
                                />
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave} fullWidth variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MultiCategorySheetButton;
