import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import ChatPage from '../../src/components/pages/ChatPage';
import { logEvent, logPageView } from '../../src/analytics'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../src/analytics', () => ({
  logEvent: jest.fn(),
  logPageView: jest.fn(),
}));

interface MockContactProps {
  handleClick: (isu: number) => void;
  person: {
    isu: number;
    username: string;
    logo: string;
  };
  lastMessage: string;
}

jest.mock('../../src/components/Contact', () => {
  const MockContact: React.FC<MockContactProps> = (props) => (
    <div data-testid="contact-card" onClick={() => props.handleClick(props.person.isu)}>
      {props.person.username}
    </div>
  );
  return {
    __esModule: true,
    default: MockContact,
  };
});

interface MockStoriesProps {
  onAddStory: () => void;
}

jest.mock('../../src/components/Stories', () => ({
  __esModule: true,
  default: (props: MockStoriesProps) => (
    <button onClick={props.onAddStory}>Add Story</button>
  ),
}));

interface AddStoryModalProps {
  open: boolean;
  onClose: () => void;
}

jest.mock('../../src/components/AddStoryModal', () => ({
  __esModule: true,
  default: (props: AddStoryModalProps) =>
    props.open ? (
      <div>
        <div>Add Story Modal Content</div>
        <button onClick={props.onClose}>Close</button>
      </div>
    ) : null,
}));

describe('ChatPage Component', () => {
  const mockContacts = [
    { isu: 1, username: 'John Doe', bio: 'Bio 1', logo: 'path/to/avatar1.jpg' },
    { isu: 2, username: 'Jane Smith', bio: 'Bio 2', logo: 'path/to/avatar2.jpg' },
  ];

  const mockStories = [
    { id: 'story1', isu: 1, url: 'path/to/story1.jpg', expiration_date: 1731926899 },
    { id: 'story2', isu: 2, url: 'path/to/story2.jpg', expiration_date: 1731926899 },
  ];

  const mockMessages = [
    { id: 'msg1', chat_id: 'chat1', sender_id: 1, receiver_id: 2, text: 'Hello!', timestamp: '2024-11-11T10:00:00Z' },
    { id: 'msg2', chat_id: 'chat1', sender_id: 2, receiver_id: 1, text: 'Hi there!', timestamp: '2024-11-11T10:01:00Z' },
  ];

  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with contacts', () => {
    render(
      <MemoryRouter>
        <ChatPage people={mockContacts} stories={mockStories} messages={mockMessages} />
      </MemoryRouter>
    );
    expect(screen.getByText('Chats')).toBeInTheDocument();
    expect(screen.getByLabelText('Search Contacts')).toBeInTheDocument();
    expect(screen.getByText('Activities')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(logPageView).toHaveBeenCalledWith('/chats');

  });

  it('filters contacts based on search query', () => {
    render(
      <MemoryRouter>
        <ChatPage people={mockContacts} stories={mockStories} messages={mockMessages} />
      </MemoryRouter>
    );
    const searchInput = screen.getByLabelText('Search Contacts');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('displays "No contacts found" when search yields no results', () => {
    render(
      <MemoryRouter>
        <ChatPage people={mockContacts} stories={mockStories} messages={mockMessages} />
      </MemoryRouter>
    );
    const searchInput = screen.getByLabelText('Search Contacts');
    fireEvent.change(searchInput, { target: { value: 'Alice' } });
    expect(screen.getByText('No contacts found.')).toBeInTheDocument();
  });

  it('navigates to correct chat when a contact is clicked', () => {
    render(
      <MemoryRouter>
        <ChatPage people={mockContacts} stories={mockStories} messages={mockMessages} />
      </MemoryRouter>
    );
    const contactCard = screen.getByText('John Doe');
    fireEvent.click(contactCard);
    expect(mockNavigate).toHaveBeenCalledWith('/chat/1');
  });

  it('opens and closes the AddStoryModal', () => {
    render(
      <MemoryRouter>
        <ChatPage people={mockContacts} stories={mockStories} messages={mockMessages} />
      </MemoryRouter>
    );
    const addStoryButton = screen.getByText('Add Story');
    fireEvent.click(addStoryButton);
    expect(screen.getByText('Add Story Modal Content')).toBeInTheDocument();
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    expect(screen.queryByText('Add Story Modal Content')).not.toBeInTheDocument();
  });
});
