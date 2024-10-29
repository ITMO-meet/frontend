import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HorizontalButtonGroup from '../../../src/components/basic/HorizontalButtonGroup';

describe('HorizontalButtonGroup', () => {
    const mockOnButtonClick = jest.fn();

    beforeEach(() => {
        render(
            <HorizontalButtonGroup
                options={['Option 1', 'Option 2', 'Option 3']}
                spacing={10}
                onButtonClick={mockOnButtonClick}
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
        fireEvent.click(button);
        expect(mockOnButtonClick).toHaveBeenCalledWith('Option 1');
    });
});
