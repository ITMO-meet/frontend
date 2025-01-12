import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultiCategorySheetButton, { ButtonSelectCategoryOption, CategoryOption, LanguageSelectCategoryOption, SelectCategoryOption, SliderCategoryOption } from '../../src/components/basic/MultiCategorySheetButton';

describe('MultiCategorySheetButton', () => {
    const mockOnSave = jest.fn();

    const renderComponent = (category: CategoryOption) => {
        return render(
            <MultiCategorySheetButton
                label="Test Label"
                category={category}
                onSave={mockOnSave}
            />
        );
    };

    test('renders slider category correctly', () => {
        const category: SliderCategoryOption = { type: 'slider', label: 'Height', min: 0, max: 200 };
        renderComponent(category);

        fireEvent.click(screen.getByText('Test Label'));
        expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    test('renders select category correctly', () => {
        const category: SelectCategoryOption = { type: 'select', label: 'Options', options: ['Option 1', 'Option 2'] };
        renderComponent(category);

        fireEvent.click(screen.getByText('Test Label'));
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    test('renders buttonSelect category correctly', () => {
        const category: ButtonSelectCategoryOption = { type: 'buttonSelect', label: 'Buttons', options: ['Button 1', 'Button 2'] };
        renderComponent(category);

        fireEvent.click(screen.getByText('Test Label'));
        expect(screen.getByText('Button 1')).toBeInTheDocument();
        expect(screen.getByText('Button 2')).toBeInTheDocument();
    });

    test('renders languageSelect category correctly', () => {
        const category: LanguageSelectCategoryOption = { type: 'languageSelect', label: 'Languages' };
        renderComponent(category);

        fireEvent.click(screen.getByText('Test Label'));
        expect(screen.getByPlaceholderText('Search language')).toBeInTheDocument();
    });

    test('calls onSave when save button is clicked', () => {
        const sliderCategory: SliderCategoryOption = { type: 'slider', label: 'Height', min: 0, max: 200, selectedValue: 100 };
        renderComponent(sliderCategory);

        fireEvent.click(screen.getByText('Height'));

        // Wait for the dialog to appear and locate the Save button
        const saveButton = screen.getByRole('button', { name: /save/i });
        expect(saveButton).toBeInTheDocument();

        // Simulate clicking the "Save" button
        fireEvent.click(saveButton);

        // Verify that onSave was called once
        expect(mockOnSave).toHaveBeenCalledTimes(1);
        expect(mockOnSave).toHaveBeenCalledWith("Height", 100);
    });
});
