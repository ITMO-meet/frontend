import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DynamicCategoryDialog from '../../src/components/basic/DynamicCategoryDialog';

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

describe('DynamicCategoryDialog', () => {
    const mockOnClose = jest.fn();
    const mockOnSave = jest.fn();

    const renderComponent = (category: Category) => {
        return render(
            <DynamicCategoryDialog
                open={true}
                category={category}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );
    };

    test('renders slider category correctly', () => {
        const category: SliderCategory = { type: 'slider', label: 'Height', min: 0, max: 200 };
        const { getByText, getByRole } = renderComponent(category);

        expect(getByText('Height: 0')).toBeTruthy();
        expect(getByRole('slider')).toBeTruthy();
    });

    test('renders select category correctly', () => {
        const category: SelectCategory = { type: 'select', label: 'Options', options: ['Option 1', 'Option 2'] };
        const { getByText } = renderComponent(category);

        expect(getByText('Options')).toBeTruthy();
        expect(getByText('Option 1')).toBeTruthy();
        expect(getByText('Option 2')).toBeTruthy();
    });

    test('renders buttonSelect category correctly', () => {
        const category: ButtonSelectCategory = { type: 'buttonSelect', label: 'Buttons', options: ['Button 1', 'Button 2'] };
        const { getByText } = renderComponent(category);

        expect(getByText('Buttons')).toBeTruthy();
        expect(getByText('Button 1')).toBeTruthy();
        expect(getByText('Button 2')).toBeTruthy();
    });

    test('renders languageSelect category correctly', () => {
        const category: LanguageSelectCategory = { type: 'languageSelect', label: 'Languages' };
        const { getByText } = renderComponent(category);

        expect(getByText('Languages')).toBeTruthy();
        expect(getByText('Добавить язык')).toBeTruthy();
    });

    test('calls onSave and onClose when save button is clicked', () => {
        const category: SliderCategory = { type: 'slider', label: 'Height', min: 0, max: 200 };
        const { getByText } = renderComponent(category);

        fireEvent.click(getByText('Сохранить'));

        expect(mockOnSave).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });

    test('updates state when slider value changes', () => {
        const category: SliderCategory = { type: 'slider', label: 'Height', min: 0, max: 200 };
        const { getByRole } = renderComponent(category);

        const slider = getByRole('slider');
        fireEvent.change(slider, { target: { value: 150 } });

        expect(slider).toHaveProperty('value', '150');
    });

    test('calls onClose when cancel button is clicked', () => {
        const category: SliderCategory = { type: 'slider', label: 'Height', min: 0, max: 200 };
        const { getByText } = renderComponent(category);

        fireEvent.click(getByText('Отмена'));

        expect(mockOnClose).toHaveBeenCalled();
    });

    test('adds a new language when "Добавить язык" is clicked', () => {
        const category: LanguageSelectCategory = { type: 'languageSelect', label: 'Languages' };
        const { getByText, getByRole } = renderComponent(category);

        fireEvent.click(getByText('Добавить язык'));

        // Проверка, что появилось новое поле для ввода языка
        expect(getByRole('textbox')).toBeInTheDocument();
    });

    test('removes a language when delete button is clicked', () => {
        const category: LanguageSelectCategory = { type: 'languageSelect', label: 'Languages' };
        const { getByText, getAllByRole, getByTestId } = renderComponent(category);

        fireEvent.click(getByText('Добавить язык'));
        fireEvent.click(getByText('Добавить язык'));

        // Проверка, что появилось два поля для ввода языка
        expect(getAllByRole('textbox').length).toBe(2);

        // Удаление одного языка
        fireEvent.click(getByTestId('delete-button-0'));

        // Проверка, что осталось одно поле для ввода языка
        expect(getAllByRole('textbox').length).toBe(1);
    });
});