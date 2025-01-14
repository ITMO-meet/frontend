import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useParams, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import Messages from '../../src/components/Messages';

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

  it('adds an audio message when recording is stopped', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages people={mockContacts} messages={mockMessages} />
      </MemoryRouter>
    );

    const micButton = screen.getAllByRole('button').find(
      (button) => button.querySelector('svg[data-testid="MicIcon"]')
    )!;
    fireEvent.mouseDown(micButton);
    
    // Simulate recording stop
    fireEvent.mouseUp(micButton);

    // Ensure that an audio message is added
    expect(screen.getByText('Voice message')).toBeInTheDocument();
  });

  it('adds a video message when recording is stopped', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages people={mockContacts} messages={mockMessages} />
      </MemoryRouter>
    );

    const videoButton = screen.getAllByRole('button').find(
      (button) => button.querySelector('svg[data-testid="VideocamIcon"]')
    )!;
    fireEvent.click(videoButton); // Start recording
    fireEvent.click(videoButton); // Stop recording

    // Ensure that a video message is added
    const videoElement = screen.getByRole('video');
    expect(videoElement).toBeInTheDocument();
  });

  it('adds an image message when a file is selected from the gallery', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages people={mockContacts} messages={mockMessages} />
      </MemoryRouter>
    );

    const galleryInput = screen.getByTestId('gallery-input') as HTMLInputElement;
    const file = new File(['image-content'], 'test-image.jpg', { type: 'image/jpeg' });
    fireEvent.change(galleryInput, { target: { files: [file] } });

    expect(screen.getByAltText('Sent')).toBeInTheDocument();
  });

  it('adds a file message when a file is selected from the file manager', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages people={mockContacts} messages={mockMessages} />
      </MemoryRouter>
    );

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    const file = new File(['file-content'], 'test-document.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
  });

  it('displays the picker modal when the attachment button is clicked', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages people={mockContacts} messages={mockMessages} />
      </MemoryRouter>
    );

    const attachmentButton = screen.getByTestId('attachment-button');
    fireEvent.click(attachmentButton);

    expect(screen.getByText('Select an Option')).toBeInTheDocument();
  });

  it('closes the picker modal when the modal is dismissed', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages people={mockContacts} messages={mockMessages} />
      </MemoryRouter>
    );

    const attachmentButton = screen.getByTestId('attachment-button');
    fireEvent.click(attachmentButton);

    const modal = screen.getByRole('dialog');
    fireEvent.keyDown(modal, { key: 'Escape' });

    expect(modal).not.toBeInTheDocument();
  });
});
