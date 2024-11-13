import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputText from '../../../src/components/basic/InputText';

describe('InputText', () => {
    it('custom properties', () => {
        render(<InputText id='123' width={"50%"} label={"lab"} />);
        const input = screen.getByRole('textbox');
        const label = screen.getByText("lab")

        expect(input).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(input).toHaveAttribute("id", "123");
    });

    it('calls onChange handler', () => {
        const handleChange = jest.fn();
        render(<InputText onChange={handleChange} />);

        const inputElement = screen.getByRole("textbox");
        fireEvent.change(inputElement, { target: { value: 'New Value' } });

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
            target: expect.objectContaining({
                value: 'New Value' 
            })
        }));
    });
});