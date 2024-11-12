import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QuestionChoice } from '../../../src/components/basic/QuestionChoice';

describe('QuestionChoice', () => {
    let mockOnFinish: jest.Mock;
    let container: HTMLElement;

    beforeEach(() => {
        mockOnFinish = jest.fn(); 
        ({ container } = render(<QuestionChoice onFinish={mockOnFinish} options={"1234567".split("")} />));
    });

    it('renders options correctly', () => {
        const options = ["1", "2", "3", "4", "5", "6", "7"];
        options.forEach(option => {
            expect(screen.getByText(option)).toBeInTheDocument();
        });
    });

    it('selects an option when clicked', () => {
        const firstOpt = container.getElementsByClassName("option-choice")[0]
        const button = screen.getByRole('button');

        expect(button).toBeDisabled(); 
        fireEvent.click(firstOpt);
        expect(button).toBeEnabled(); 
    });

    it('calls onFinish with the selected option', () => {
        const firstOpt = container.getElementsByClassName("option-choice")[0]
        const secondOpt = container.getElementsByClassName("option-choice")[1]
        const button = screen.getByRole('button');

        fireEvent.click(firstOpt);
        fireEvent.click(button);
        expect(mockOnFinish).toHaveBeenCalledWith(0);

        fireEvent.click(secondOpt);
        fireEvent.click(button);
        expect(mockOnFinish).toHaveBeenCalledWith(1);
    });

    it('disables continue button when no option is selected', () => {
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });
});