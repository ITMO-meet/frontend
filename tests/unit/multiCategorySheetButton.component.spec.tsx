import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MultiCategorySheetButton from '../../src/components/basic/MultiCategorySheetButton';

describe('MultiCategorySheetButton', () => {
    const mockOnSave = jest.fn();

    const renderComponent = (category: any) => {
        return render(
            <MultiCategorySheetButton
                label="Select an option"
                category={category}
                onSave={mockOnSave}
            />
        );
    };

    test('renders button with label', () => {
        const category = { label: 'Height', type: 'slider', min: 100, max: 200 };
        const { getByText } = renderComponent(category);

        expect(getByText('Height')).toBeTruthy();
        expect(getByText('100')).toBeTruthy(); // Начальное значение для слайдера
    });

    test('opens bottom sheet on button click', () => {
        const category = { label: 'Height', type: 'slider', min: 100, max: 200 };
        const { getByText, getByRole } = renderComponent(category);

        fireEvent.click(getByText('Height'));

        expect(getByRole('dialog')).toBeTruthy();
    });

    test('saves selected slider value', () => {
        const category = { label: 'Height', type: 'slider', min: 100, max: 200 };
        const { getByText, getByRole } = renderComponent(category);

        fireEvent.click(getByText('Height'));

        const slider = getByRole('slider');
        fireEvent.change(slider, { target: { value: 150 } });

        fireEvent.click(getByText('Save'));

        expect(mockOnSave).toHaveBeenCalledWith('Height', 150);
    });

    test('saves selected button value', () => {
        const category = { label: 'Preference', type: 'buttonSelect', options: ['Option 1', 'Option 2'] };
        const { getByText } = renderComponent(category);

        fireEvent.click(getByText('Preference'));

        fireEvent.click(getByText('Option 1'));
        fireEvent.click(getByText('Save'));

        expect(mockOnSave).toHaveBeenCalledWith('Preference', 'Option 1');
    });

    test('filters languages in search', () => {
        const category = { label: 'Languages', type: 'languageSelect' };
        const { getByText, getByPlaceholderText } = renderComponent(category);

        fireEvent.click(getByText('Languages'));

        const searchInput = getByPlaceholderText('Search language');
        fireEvent.change(searchInput, { target: { value: 'English' } });

        expect(getByText('English')).toBeTruthy();
    });
});