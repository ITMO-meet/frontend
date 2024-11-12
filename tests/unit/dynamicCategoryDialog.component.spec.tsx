import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DynamicCategoryDialog from '../../src/components/basic/DynamicCategoryDialog';

describe('DynamicCategoryDialog', () => {
    const mockOnClose = jest.fn();
    const mockOnSave = jest.fn();

    const renderComponent = (category: any) => {
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
        const category = { type: 'slider', label: 'Height', min: 0, max: 200 };
        const { getByText, getByRole } = renderComponent(category);

        expect(getByText('Height: 0')).toBeTruthy();
        expect(getByRole('slider')).toBeTruthy();
    });

    test('renders select category correctly', () => {
        const category = { type: 'select', label: 'Options', options: ['Option 1', 'Option 2'] };
        const { getByText } = renderComponent(category);

        expect(getByText('Options')).toBeTruthy();
        expect(getByText('Option 1')).toBeTruthy();
        expect(getByText('Option 2')).toBeTruthy();
    });

    test('renders buttonSelect category correctly', () => {
        const category = { type: 'buttonSelect', label: 'Buttons', options: ['Button 1', 'Button 2'] };
        const { getByText } = renderComponent(category);

        expect(getByText('Buttons')).toBeTruthy();
        expect(getByText('Button 1')).toBeTruthy();
        expect(getByText('Button 2')).toBeTruthy();
    });

    test('renders languageSelect category correctly', () => {
        const category = { type: 'languageSelect', label: 'Languages' };
        const { getByText } = renderComponent(category);

        expect(getByText('Languages')).toBeTruthy();
        expect(getByText('Добавить язык')).toBeTruthy();
    });

    test('calls onSave and onClose when save button is clicked', () => {
        const category = { type: 'slider', label: 'Height', min: 0, max: 200 };
        const { getByText } = renderComponent(category);

        fireEvent.click(getByText('Сохранить'));

        expect(mockOnSave).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });

    test('updates state when slider value changes', () => {
        const category = { type: 'slider', label: 'Height', min: 0, max: 200 };
        const { getByRole } = renderComponent(category);

        const slider = getByRole('slider');
        fireEvent.change(slider, { target: { value: 150 } });

        expect(slider).toHaveProperty('value', '150');
    });
});