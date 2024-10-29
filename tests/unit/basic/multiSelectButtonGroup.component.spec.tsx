import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultiSelectButtonGroup from '../../../src/components/basic/MultiSelectButtonGroup';

describe('MultiSelectButtonGroup', () => {
    const mockOnButtonClick = jest.fn();

    beforeEach(() => {
        render(
            <MultiSelectButtonGroup
                options={['Option 1', 'Option 2', 'Option 3']}
                onClickOption={mockOnButtonClick}
            />
        );
    });

    it('renders buttons with correct text', () => {
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(3);
        expect(buttons[0]).toHaveTextContent('Option 1');
        expect(buttons[1]).toHaveTextContent('Option 2');
        expect(buttons[2]).toHaveTextContent('Option 3');
    });

    it('calls onButtonClick with the correct option when a button is clicked', () => {
        const button = screen.getByText('Option 1');
        const button2 = screen.getByText('Option 2');
        const button3 = screen.getByText('Option 3');

        fireEvent.click(button);
        expect(mockOnButtonClick).toHaveBeenCalledWith(['Option 1']);

        fireEvent.click(button2);
        expect(mockOnButtonClick).toHaveBeenCalledWith(['Option 1', 'Option 2']);

        fireEvent.click(button3);
        expect(mockOnButtonClick).toHaveBeenCalledWith(['Option 1', 'Option 2', 'Option 3']);
    });
});