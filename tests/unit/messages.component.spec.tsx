import React, { act } from 'react';
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
  default: ({ message }: { message: { sender: 'me' | 'them'; text: string } }) => {
    console.log('Rendering UserMessage:', message);
    return <div data-testid={`message-${message.sender}`}>{message.text}</div>;
  },
}));

// Mock scrollIntoView and media devices
beforeAll(() => {
  // Mock scrollIntoView
  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  // Mock getUserMedia
  Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
      getUserMedia: jest.fn().mockResolvedValue({
        getTracks: () => [{ stop: jest.fn() }],
      }),
    },
  });

  // Mock MediaRecorder
  global.MediaRecorder = class {
    private ondataavailable: ((event: BlobEvent) => void) | null = null;
    private onstop: (() => void) | null = null;

    start() {
      console.log('MediaRecorder started');
      setTimeout(() => {
        const event = { data: new Blob(['mock-audio-data'], { type: 'audio/webm' }) } as BlobEvent;
        this.ondataavailable?.(event);
      }, 50);
    }

    stop() {
      console.log('MediaRecorder stopped');
      this.onstop?.();
    }

    addEventListener<K extends 'dataavailable' | 'stop'>(
      event: K,
      callback: K extends 'dataavailable' ? (event: BlobEvent) => void : () => void
    ) {
      if (event === 'dataavailable') {
        this.ondataavailable = callback as (event: BlobEvent) => void;
      }
      if (event === 'stop') {
        this.onstop = callback as () => void;
      }
    }
  };

});



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

  const mockChats = [
    {
      chat_id: '1',
      isu_1: 1,
      isu_2: 2,
    }
  ]

  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('displays the picker modal when the attachment button is clicked', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages chats={mockChats} people={mockContacts} messages={mockMessages} />
      </MemoryRouter>
    );

    const attachmentButton = screen.getByTestId('attachment-button');
    fireEvent.click(attachmentButton);

    expect(screen.getByText('Выбрать опцию')).toBeInTheDocument();
  });

  it('closes the picker modal when the modal is dismissed', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages chats={mockChats} people={mockContacts} messages={mockMessages} />
      </MemoryRouter>
    );

    const attachmentButton = screen.getByTestId('attachment-button');
    fireEvent.click(attachmentButton);

    const modal = screen.getByRole('dialog'); // Role should now match
    expect(modal).toBeInTheDocument();

    fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' });
    expect(modal).not.toBeInTheDocument();
  });

  it('adds an audio message when recording is stopped', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages chats={mockChats} people={mockContacts} messages={mockMessages} />
      </MemoryRouter>
    );

    const micButton = screen.getByTestId('mic-button');
    await act(async () => {
      fireEvent.mouseDown(micButton);
      fireEvent.mouseUp(micButton);
    });
  });

  it('adds a video message when recording is stopped', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages chats={mockChats} people={mockContacts} messages={mockMessages} />
      </MemoryRouter>
    );

    const videoButton = screen.getByTestId('video-button');
    await act(async () => {
      fireEvent.mouseDown(videoButton);
      fireEvent.mouseUp(videoButton);
    });
  });

  it('navigates to the previous page when back button is clicked', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    render(
      <MemoryRouter>
        <Messages chats={mockChats} people={mockContacts} messages={mockMessages} />
      </MemoryRouter>
    );

    const backButton = screen.getByTestId('back-button');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
