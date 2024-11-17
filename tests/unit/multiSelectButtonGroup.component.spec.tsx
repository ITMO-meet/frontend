import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MultiSelectButtonGroup from '../../src/components/basic/MultiSelectButtonGroup';

describe('MultiSelectButtonGroup', () => {
    const mockOnClickOption = jest.fn();

    const renderComponent = (options: string[]) => {
        return render(
            <MultiSelectButtonGroup
                options={options}
                onClickOption={mockOnClickOption}
            />
        );
    };

    test('renders all options as buttons', () => {
        const options = ['Option 1', 'Option 2', 'Option 3'];
        const { getByText } = renderComponent(options);

        options.forEach(option => {
            expect(getByText(option)).toBeTruthy();
        });
    });

    test('toggles option selection on button click', () => {
        const options = ['Option 1', 'Option 2', 'Option 3'];
        const { getByText } = renderComponent(options);

        const option1Button = getByText('Option 1');
        fireEvent.click(option1Button);

        expect(mockOnClickOption).toHaveBeenCalledWith(['Option 1']);

        fireEvent.click(option1Button);

        expect(mockOnClickOption).toHaveBeenCalledWith([]);
    });

    test('selects multiple options', () => {
        const options = ['Option 1', 'Option 2', 'Option 3'];
        const { getByText } = renderComponent(options);

        const option1Button = getByText('Option 1');
        const option2Button = getByText('Option 2');

        fireEvent.click(option1Button);
        fireEvent.click(option2Button);

        expect(mockOnClickOption).toHaveBeenCalledWith(['Option 1', 'Option 2']);
    });
});