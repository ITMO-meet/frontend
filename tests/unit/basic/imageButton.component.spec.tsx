import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageButton from '../../../src/components/basic/ImageButton';

describe('ImageButton', () => {
    it('custom properties', () => {
        render(<ImageButton id='123' radius='56px'>Text content</ImageButton>);
        const button = screen.getByRole('button');

        expect(button).toHaveStyle('width: 56px');
        expect(button).toHaveStyle('height: 56px');
        expect(button).toHaveAttribute("id", "123");
        expect(button).toHaveTextContent("Text content");
    });

    it('onClick call', () => {
        const handleClick = jest.fn();
        render(<ImageButton onClick={handleClick} />);
        const button = screen.getByRole('button');

        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
