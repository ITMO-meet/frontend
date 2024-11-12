import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import TargetSheetButton from '../../src/components/basic/TargetSheetButton';
import '@testing-library/jest-dom';

describe('TargetSheetButton', () => {
    const mockOnSelect = jest.fn();

    const sampleOptions = [
        { icon: <div>Icon1</div>, label: 'Option 1', description: 'Description 1' },
        { icon: <div>Icon2</div>, label: 'Option 2', description: 'Description 2' },
    ];

    const renderComponent = () =>
        render(<TargetSheetButton label="Choose an option" icon={<div>Main Icon</div>} options={sampleOptions} onSelect={mockOnSelect} />);

    test('renders button with label', () => {
        const { getByText } = renderComponent();
        expect(getByText('Choose an option')).toBeInTheDocument();
    });

    test('opens bottom sheet on button click', () => {
        const { getByText, getByRole } = renderComponent();

        fireEvent.click(getByText('Choose an option'));
        expect(getByRole('dialog')).toBeInTheDocument();
    });

    test('displays options in bottom sheet', () => {
        const { getByText } = renderComponent();

        fireEvent.click(getByText('Choose an option'));
        expect(getByText('Option 1')).toBeInTheDocument();
        expect(getByText('Option 2')).toBeInTheDocument();
    });

    test('calls onSelect with the selected option when save is clicked', () => {
        const { getByText } = renderComponent();

        fireEvent.click(getByText('Choose an option'));
        fireEvent.click(getByText('Option 1'));
        fireEvent.click(getByText('Сохранить'));

        expect(mockOnSelect).toHaveBeenCalledWith(sampleOptions[0]);
    });

    test('closes bottom sheet when cancel is clicked', async () => {
        const { getByText, queryByRole } = renderComponent();

        fireEvent.click(getByText('Choose an option'));
        fireEvent.click(getByText('Отмена'));
        
        // Используем waitFor для ожидания закрытия модального окна
        await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument());
    });
});
