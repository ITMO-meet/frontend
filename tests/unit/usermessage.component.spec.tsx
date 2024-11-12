import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserMessage from '../../src/components/UserMessage';
import { Message } from '../../src/types';


describe('UserMessage Component', () => {
    const renderComponent = (message: Message) => {
        return render(<UserMessage message={message} />);
    };

    it('renders the message text correctly', () => {
        const message: Message = { sender: 'me', text: 'Hello, World!' };
        renderComponent(message);
        expect(screen.getByText('Hello, World!')).toBeInTheDocument();
    });

    it('aligns the message to the right when sender is "me"', () => {
        const message: Message = { sender: 'me', text: 'This is my message.' };
        const { container } = renderComponent(message);
        const listItem = container.querySelector('li');
        expect(listItem).toHaveStyle('justify-content: flex-end');
    });

    it('aligns the message to the left when sender is "them"', () => {
        const message: Message = { sender: 'them', text: 'This is their message.' };
        const { container } = renderComponent(message);
        const listItem = container.querySelector('li');
        expect(listItem).toHaveStyle('justify-content: flex-start');
    });

    it('applies correct background color for messages sent by "me"', () => {
        const message: Message = { sender: 'me', text: 'Background color test.' };
        const { container } = renderComponent(message);
        const box = container.querySelector('li > div');
        expect(box).toHaveStyle('background-color: #dcf8c6');
    });

    it('applies correct background color for messages sent by "them"', () => {
        const message: Message = { sender: 'them', text: 'Background color test.' };
        const { container } = renderComponent(message);
        const box = container.querySelector('li > div');
        expect(box).toHaveStyle('background-color: #ffffff');
    });

    it('applies correct border radius for messages sent by "me"', () => {
        const message: Message = { sender: 'me', text: 'Border radius test.' };
        const { container } = renderComponent(message);
        const box = container.querySelector('li > div');
        expect(box).toHaveStyle('border-radius: 15px 15px 5px 15px');
    });

    it('applies correct border radius for messages sent by "them"', () => {
        const message: Message = { sender: 'them', text: 'Border radius test.' };
        const { container } = renderComponent(message);
        const box = container.querySelector('li > div');
        expect(box).toHaveStyle('border-radius: 15px 15px 15px 5px');
    });

    it('handles long text with word break', () => {
        const longText = 'This is a very long message that should break into multiple lines to ensure that the word-break property is working correctly.';
        const message: Message = { sender: 'me', text: longText };
        const { container } = renderComponent(message);
        const box = container.querySelector('li > div');
        expect(box).toHaveStyle('word-break: break-word');
        expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('matches the snapshot for sender "me"', () => {
        const message: Message = { sender: 'me', text: 'Snapshot test for me.' };
        const { asFragment } = renderComponent(message);
        expect(asFragment()).toMatchSnapshot();
    });

    it('matches the snapshot for sender "them"', () => {
        const message: Message = { sender: 'them', text: 'Snapshot test for them.' };
        const { asFragment } = renderComponent(message);
        expect(asFragment()).toMatchSnapshot();
    });
});
