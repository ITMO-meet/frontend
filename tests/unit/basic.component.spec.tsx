// import React from 'react';
// import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// import RoundButton from '../../src/components/basic/RoundButton';
// import ImageButton from '../../src/components/basic/ImageButton';
// import InputText from '../../src/components/basic/InputText';
// import HorizontalButtonGroup from '../../src/components/basic/HorizontalButtonGroup';
// import MultiSelectButtonGroup from '../../src/components/basic/MultiSelectButtonGroup';

it("Obsoleted file", () => {
    expect(1).toBe(1);
})

// // RoundButton component
// describe('RoundButton', () => {
//     it('custom properties', () => {
//         render(<RoundButton id='123' width='80%'>Text content</RoundButton>);
//         const button = screen.getByRole('button');

//         expect(button).toHaveStyle('width: 80%');
//         expect(button).toHaveAttribute("id", "123");
//         expect(button).toHaveTextContent("Text content");
//     });

//     it('onClick call', () => {
//         const handleClick = jest.fn();
//         render(<RoundButton onClick={() => handleClick()} />);
//         const button = screen.getByRole('button');

//         fireEvent.click(button);
//         expect(handleClick).toHaveBeenCalledTimes(1);
//     });

// });

// // ImageButton component
// describe('ImageButton', () => {
//     it('custom properties', () => {
//         render(<ImageButton id='123' radius='56px'>Text content</ImageButton>);
//         const button = screen.getByRole('button');

//         expect(button).toHaveStyle('width: 56px');
//         expect(button).toHaveStyle('height: 56px');
//         expect(button).toHaveAttribute("id", "123");
//         expect(button).toHaveTextContent("Text content");
//     });

//     it('onClick call', () => {
//         const handleClick = jest.fn();
//         render(<ImageButton onClick={handleClick} />);
//         const button = screen.getByRole('button');

//         fireEvent.click(button);
//         expect(handleClick).toHaveBeenCalledTimes(1);
//     });
// });

// // InputText component
// describe('InputText', () => {
//     it('custom properties', () => {
//         render(<InputText id='123' width={"50%"} label={"lab"} />);
//         const input = screen.getByRole('textbox');
//         const label = screen.getByText("lab")

//         expect(input).toBeInTheDocument();
//         expect(label).toBeInTheDocument();
//         expect(input).toHaveAttribute("id", "123");
//     });

//     it('calls onChange handler', () => {
//         const handleChange = jest.fn();
//         render(<InputText onChange={handleChange} />);

//         const inputElement = screen.getByRole("textbox");
//         fireEvent.change(inputElement, { target: { value: 'New Value' } });

//         expect(handleChange).toHaveBeenCalledTimes(1);
//         expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
//             target: expect.objectContaining({
//                 value: 'New Value' // Check the value within the target object
//             })
//         }));
//     });
// });

// // HorizontalButtonGroup
// describe('HorizontalButtonGroup', () => {
//     const mockOnButtonClick = jest.fn();

//     beforeEach(() => {
//         render(
//             <HorizontalButtonGroup
//                 options={['Option 1', 'Option 2', 'Option 3']}
//                 spacing={10}
//                 onButtonClick={mockOnButtonClick}
//             />
//         );
//     });

//     it('renders buttons with correct text', () => {
//         const buttons = screen.getAllByRole('button');
//         expect(buttons).toHaveLength(3);
//         expect(buttons[0]).toHaveTextContent('Option 1');
//         expect(buttons[1]).toHaveTextContent('Option 2');
//         expect(buttons[2]).toHaveTextContent('Option 3');
//     });

//     it('calls onButtonClick with the correct option when a button is clicked', () => {
//         const button = screen.getByText('Option 1');
//         fireEvent.click(button);
//         expect(mockOnButtonClick).toHaveBeenCalledWith('Option 1');
//     });
// });

// describe('MultiSelectButtonGroup', () => {
//     const mockOnButtonClick = jest.fn();

//     beforeEach(() => {
//         render(
//             <MultiSelectButtonGroup
//                 options={['Option 1', 'Option 2', 'Option 3']}
//                 onClickOption={mockOnButtonClick}
//             />
//         );
//     });

//     it('renders buttons with correct text', () => {
//         const buttons = screen.getAllByRole('button');
//         expect(buttons).toHaveLength(3);
//         expect(buttons[0]).toHaveTextContent('Option 1');
//         expect(buttons[1]).toHaveTextContent('Option 2');
//         expect(buttons[2]).toHaveTextContent('Option 3');
//     });

//     it('calls onButtonClick with the correct option when a button is clicked', () => {
//         const button = screen.getByText('Option 1');
//         const button2 = screen.getByText('Option 2');
//         const button3 = screen.getByText('Option 3');

//         fireEvent.click(button);
//         expect(mockOnButtonClick).toHaveBeenCalledWith(['Option 1']);

//         fireEvent.click(button2);
//         expect(mockOnButtonClick).toHaveBeenCalledWith(['Option 1', 'Option 2']);

//         fireEvent.click(button3);
//         expect(mockOnButtonClick).toHaveBeenCalledWith(['Option 1', 'Option 2', 'Option 3']);
//     });
// });