import React from 'react';
import { fireEvent, getByTestId, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultiSelectButtonGroup from '../../../src/components/basic/MultiSelectButtonGroup';

describe('MultiSelectButtonGroup', () => {
    let mockOnButtonClick: jest.Mock;

    beforeEach(() => {
        mockOnButtonClick = jest.fn();
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

    it('initially renders all buttons as unselected', () => {
        const buttons = screen.getAllByRole('button');
        buttons.forEach(button => {
            expect(button).not.toHaveAttribute('aria-pressed', 'true'); // Assuming aria-pressed is used for selected state
        });
    });

    it('displays CheckIcon on selected buttons', () => {
        const button1 = screen.getByText('Option 1');
    
        // Click Option 1
        fireEvent.click(button1);
        expect(button1).toContainElement(screen.getByTestId("CheckIcon"));
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

    it('disadles the selection after clicked twice', () => {
        const button1 = screen.getByText('Option 1');
    
        fireEvent.click(button1);
        expect(mockOnButtonClick).toHaveBeenCalledWith(['Option 1']);
        expect(mockOnButtonClick).toHaveBeenCalledTimes(1);

        fireEvent.click(button1);
        expect(mockOnButtonClick).toHaveBeenCalledTimes(2);
        expect(mockOnButtonClick).toHaveBeenCalledWith([]);
    });
});