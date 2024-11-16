import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import ChatPage from '../../src/components/pages/ChatPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

interface MockContactProps {
  handleClick: (id: number) => void;
  contact: {
    id: number;
    name: string;
  };
}

jest.mock('../../src/components/Contact', () => {
    const MockContact: React.FC<MockContactProps> = (props) => (
      <div data-testid="contact-card" onClick={() => props.handleClick(props.contact.id)}>
        {props.contact.name}
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
    { id: 1, name: 'John Doe', pfp: 'path/to/avatar1.jpg', lastMessage: 'Hello!', stories: [] },
    { id: 2, name: 'Jane Smith', pfp: 'path/to/avatar2.jpg', lastMessage: 'How are you?', stories: [] },
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
        <ChatPage contacts={mockContacts} />
      </MemoryRouter>
    );
    expect(screen.getByText('Chats')).toBeInTheDocument();
    expect(screen.getByLabelText('Search Contacts')).toBeInTheDocument();
    expect(screen.getByText('Activities')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('filters contacts based on search query', () => {
    render(<ChatPage contacts={mockContacts} />);
    const searchInput = screen.getByLabelText('Search Contacts');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('displays "No contacts found" when search yields no results', () => {
    render(<ChatPage contacts={mockContacts} />);
    const searchInput = screen.getByLabelText('Search Contacts');
    fireEvent.change(searchInput, { target: { value: 'Alice' } });
    expect(screen.getByText('No contacts found.')).toBeInTheDocument();
  });

  it('navigates to correct chat when a contact is clicked', () => {
    render(<ChatPage contacts={mockContacts} />);
    const contactCard = screen.getByText('John Doe');
    fireEvent.click(contactCard);
    expect(mockNavigate).toHaveBeenCalledWith('/chat/1');
  });

  it('opens and closes the AddStoryModal', () => {
    render(<ChatPage contacts={mockContacts} />);
    const addStoryButton = screen.getByText('Add Story');
    fireEvent.click(addStoryButton);
    expect(screen.getByText('Add Story Modal Content')).toBeInTheDocument();
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    expect(screen.queryByText('Add Story Modal Content')).not.toBeInTheDocument();
  });
});
