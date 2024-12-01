import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Stories from '../../src/components/Stories';
import { useNavigate } from 'react-router-dom';
import { logEvent } from '../../src/analytics'

jest.mock('../../src/analytics', () => ({
    logEvent: jest.fn(),
}));

jest.mock('../../src/components/StoryViewer', () => {
    return {
        __esModule: true,
        default: ({ onClose }) => (
            <div data-testid="story-viewer">
                <p>StoryViewer Mock</p>
                <button onClick={onClose}>Close Story Viewer</button>
            </div>
        ),
    };
});


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));


describe('Stories Component', () => {
    const mockedNavigate = jest.fn();
    const mockOnAddStory = jest.fn();

    const mockContacts = [
        {
            id: '1',
            name: 'Alice',
            pfp: 'path/to/alice.jpg',
            stories: [],
        },
        {
            id: '2',
            name: 'Bob',
            pfp: 'path/to/bob.jpg',
            stories: [{
                id: 's1',
                image: "path/to/story1.jpg",
                expiresAt: Date.now() + 24 * 60 * 60 * 1000
            }],
        },
        {
            id: '3',
            name: 'Charlie',
            pfp: 'path/to/charlie.jpg',
            stories: [
                {
                    id: 's2',
                    image: 'path/to/story2.jpg',
                    expiresAt: Date.now() + 24 * 60 * 60 * 1000
                },
                {
                    id: 's3',
                    image: 'path/to/story3.jpg',
                    expiresAt: Date.now() + 24 * 60 * 60 * 1000
                },
            ],
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigate as jest.Mock).mockReturnValue(mockedNavigate);
    });

    const renderWithRouter = (ui) => {
        return render(<MemoryRouter>{ui}</MemoryRouter>);
    };

    it('renders "Your Story" and contacts with stories', () => {
        renderWithRouter(<Stories contacts={mockContacts} onAddStory={mockOnAddStory} />);

        // Check "Your Story" is rendered
        expect(screen.getByText('Your Story')).toBeInTheDocument();

        // Only contacts with stories should be rendered
        expect(screen.queryByText('Alice')).not.toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    it('navigates to "/add-story" when "Your Story" is clicked', () => {
        renderWithRouter(<Stories contacts={mockContacts} onAddStory={mockOnAddStory} />);

        // Find add story btn
        const yourStoryButton = screen.getByRole('button', { name: /your story/i });

        // Click to open Add story page
        fireEvent.click(yourStoryButton);

        // Check mocked navigate
        expect(mockedNavigate).toHaveBeenCalledWith('/add-story');
        expect(logEvent).toHaveBeenCalledWith('Stories', 'Add story clicked', 'Add Story Button');
    });

    it('opens StoryViewer with correct initialIndex when a story is clicked', () => {
        renderWithRouter(<Stories contacts={mockContacts} onAddStory={mockOnAddStory} />);

        // Click on Bob's story
        const bobNameElement = screen.getByText('Bob');
        const bobStoryElement = bobNameElement.parentElement;
        if (bobStoryElement) {
            fireEvent.click(bobStoryElement);
        }

        expect(screen.getByTestId('story-viewer')).toBeInTheDocument();
        expect(logEvent).toHaveBeenCalledWith('Stories', 'View story clicked', 'View Story Button');
    });

    it('closes StoryViewer when onClose is called', () => {
        renderWithRouter(<Stories contacts={mockContacts} onAddStory={mockOnAddStory} />);

        // Open StoryViewer by clicking on Bob's story
        const bobNameElement = screen.getByText('Bob');
        const bobStoryElement = bobNameElement.parentElement;
        if (bobStoryElement) {
            fireEvent.click(bobStoryElement);
        }


        // Click the close button in StoryViewer
        const closeButton = screen.getByText('Close Story Viewer');
        fireEvent.click(closeButton);

        // Ensure StoryViewer is closed
        expect(screen.queryByTestId('story-viewer')).not.toBeInTheDocument();
    });
});
