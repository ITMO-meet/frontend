import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useParams, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import Messages from '../../src/components/Messages';
import { Message } from '../../src/types';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('../../src/components/UserMessage', () => ({
  __esModule: true,
  default: ({ message }: { message: { sender: 'me' | 'them'; text: string } }) => (
    <div data-testid={`message-${message.sender}`}>{message.text}</div>
  ),
}));

describe('Messages Component', () => {
  const mockContacts = [
    {
      isu: 1,
      username: 'John Doe',
      logo: 'avatar1.jpg',
    },
    {
      isu: 2,
      username: 'Jane Smith',
      logo: 'avatar2.jpg',
    },
  ];

  const mockMessages = [
    {
      id: '1',
      chat_id: '1',
      sender_id: 1,
      receiver_id: 2,
      text: 'Hello, Jane!',
      timestamp: '2024-01-01T10:00:00Z',
    },
    {
      id: '2',
      chat_id: '1',
      sender_id: 2,
      receiver_id: 1,
      text: 'Hi, John!',
      timestamp: '2024-01-01T10:01:00Z',
    },
  ];

  const mockNavigate = jest.fn();

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('renders "Contact not found" when contact does not exist', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '3' });
    render(
      <MemoryRouter>
        <Messages people={mockContacts} messages={mockMessages} />
      </MemoryRouter>
    );
    expect(screen.getByText('Contact not found')).toBeInTheDocument();
  });

  it('renders the component with initial messages when contact exists', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages people={mockContacts} messages={mockMessages} />
      </MemoryRouter>
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Hello, Jane!')).toBeInTheDocument();
    expect(screen.getByText('Hi, John!')).toBeInTheDocument();
  });

  it('updates messages when a new message is sent via send button', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages people={mockContacts} messages={mockMessages} />
      </MemoryRouter>
    );

    const inputField = screen.getByPlaceholderText('Type a message!');
    fireEvent.change(inputField, { target: { value: 'Hello there!' } });
    expect(inputField).toHaveValue('Hello there!');

    const sendButton = screen.getAllByRole('button').find(
      (button) => button.firstChild?.nodeName === 'svg'
    )!;
    fireEvent.click(sendButton);
  });

  it('updates messages when a new message is sent via Enter key', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages people={mockContacts} messages={mockMessages} />
      </MemoryRouter>
    );

    const inputField = screen.getByPlaceholderText('Type a message!');
    fireEvent.change(inputField, { target: { value: 'Testing Enter key' } });
    fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter' });

    expect(inputField).toHaveValue('');
    expect(screen.getByText('Testing Enter key')).toBeInTheDocument();
  });

  it('does not send a message if input is empty or whitespace', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages people={mockContacts} messages={mockMessages} />
      </MemoryRouter>
    );

    const inputField = screen.getByPlaceholderText('Type a message!');
    fireEvent.change(inputField, { target: { value: '   ' } });
    const sendButton = screen.getAllByRole('button').find(
      (button) => button.firstChild?.nodeName === 'svg'
    )!;
    fireEvent.click(sendButton);

    expect(inputField).toHaveValue('   ');
    expect(screen.queryByText('   ')).not.toBeInTheDocument();
  });

  it('navigates back when back button is clicked', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages people={mockContacts} messages={mockMessages} />
      </MemoryRouter>
    );

    const backButton = screen.getAllByRole('button').find(
      (button) => button.firstChild?.nodeName === 'svg' && button !== null
    )!;
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('calls scrollIntoView when messages are updated', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages people={mockContacts} messages={mockMessages} />
      </MemoryRouter>
    );

    const inputField = screen.getByPlaceholderText('Type a message!');
    fireEvent.change(inputField, { target: { value: 'Scroll test' } });
    fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter' });

    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });
});
