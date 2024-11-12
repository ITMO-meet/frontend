import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useParams, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import Messages from '../../src/Messages';
import { Message } from '../../src/types';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

interface MockUserMessageProps {
  message: Message;
}

jest.mock('../../src/components/UserMessage', () => {
  const MockUserMessage: React.FC<MockUserMessageProps> = ({ message }) => (
    <div data-testid={`message-${message.sender}`}>{message.text}</div>
  );
  return {
    __esModule: true,
    default: MockUserMessage,
  };
});

describe('Messages Component', () => {
  const mockContacts = [
    {
      id: '1',
      name: 'John Doe',
      pfp: 'avatar1.jpg',
      stories: [],
    },
    {
      id: '2',
      name: 'Jane Smith',
      pfp: 'avatar2.jpg',
      stories: [],
    },
  ];

  const mockNavigate = jest.fn();

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders "Contact not found" when contact does not exist', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '3' });
    render(
      <MemoryRouter>
        <Messages contacts={mockContacts} />
      </MemoryRouter>
    );
    expect(screen.getByText('Contact not found')).toBeInTheDocument();
  });

  it('renders the component with initial messages when contact exists', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages contacts={mockContacts} />
      </MemoryRouter>
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Hey, how are you, John Doe?')).toBeInTheDocument();
    expect(screen.getByText('I am good, thanks! How about you?')).toBeInTheDocument();
  });

  it('updates messages when a new message is sent via send button', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages contacts={mockContacts} />
      </MemoryRouter>
    );

    const inputField = screen.getByPlaceholderText('Type a message');
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
        <Messages contacts={mockContacts} />
      </MemoryRouter>
    );

    const inputField = screen.getByPlaceholderText('Type a message');
    fireEvent.change(inputField, { target: { value: 'Testing Enter key' } });
    fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter' });

    expect(inputField).toHaveValue('');
    expect(screen.getByText('Testing Enter key')).toBeInTheDocument();
  });

  it('does not send a message if input is empty or whitespace', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages contacts={mockContacts} />
      </MemoryRouter>
    );

    const inputField = screen.getByPlaceholderText('Type a message');
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
        <Messages contacts={mockContacts} />
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
        <Messages contacts={mockContacts} />
      </MemoryRouter>
    );

    const inputField = screen.getByPlaceholderText('Type a message');
    fireEvent.change(inputField, { target: { value: 'Scroll test' } });
    fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter' });

    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });
});
