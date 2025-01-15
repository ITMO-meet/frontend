import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import EditableField from '../../src/components/basic/EditableField';

describe('EditableField', () => {
    const label = 'Bio';
    const initialValue = 'Опишите себя...';

    const renderComponent = () => {
        return render(
            <EditableField
                label={label}
                initialValue={initialValue}
            />
        );
    };

    test('renders with initial value', () => {
        const { getByText } = renderComponent();

        expect(getByText(label)).toBeTruthy();
        expect(getByText(initialValue)).toBeTruthy();
    });

    test('opens bottom sheet on click', () => {
        const { getByText, getByPlaceholderText } = renderComponent();

        fireEvent.click(getByText(label));

        expect(getByPlaceholderText(`Вы редактируете ${label.toLowerCase()}...`)).toBeTruthy();
    });

    test('updates value on save', () => {
        const { getByText, getByPlaceholderText, container } = renderComponent();

        fireEvent.click(getByText(label));

        const input = getByPlaceholderText(`Вы редактируете ${label.toLowerCase()}...`);
        fireEvent.change(input, { target: { value: 'Новое значение' } });

        fireEvent.click(getByText('Сохранить'));

        // Проверяем, что новое значение отображается в основном поле
        const valueElement = container.querySelector('p');
        if (valueElement) {
            expect(valueElement.textContent).toBe('Новое значение');
        } else {
            throw new Error('Value element not found');
        }
    });

    test('does not update value on cancel', () => {
        const { getByText, getByPlaceholderText, container } = renderComponent();

        fireEvent.click(getByText(label));

        const input = getByPlaceholderText(`Вы редактируете ${label.toLowerCase()}...`);
        fireEvent.change(input, { target: { value: 'Новое значение' } });

        fireEvent.click(getByText('Отмена'));

        // Проверяем, что значение осталось прежним
        const valueElement = container.querySelector('p');
        if (valueElement) {
            expect(valueElement.textContent).toBe(initialValue);
        } else {
            throw new Error('Value element not found');
        }
    });
});