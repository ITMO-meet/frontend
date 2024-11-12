import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RoundButton from '../../../src/components/basic/RoundButton';

describe('RoundButton', () => {
    it('custom properties', () => {
        render(<RoundButton id='123' width='80%'>Text content</RoundButton>);
        const button = screen.getByRole('button');

        expect(button).toHaveStyle('width: 80%');
        expect(button).toHaveAttribute("id", "123");
        expect(button).toHaveTextContent("Text content");
    });

    it('onClick call', () => {
        const handleClick = jest.fn();
        render(<RoundButton onClick={() => handleClick()} />);
        const button = screen.getByRole('button');

        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});