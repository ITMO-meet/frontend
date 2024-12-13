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

jest.mock('../../src/components/StoryViewer', () => ({
    __esModule: true,
    default: ({ onClose }: { onClose: () => void }) => (
        <div data-testid="story-viewer">
            <p>StoryViewer Mock</p>
            <button onClick={onClose}>Close Story Viewer</button>
        </div>
    ),
}));


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));


describe('Stories Component', () => {
    const mockedNavigate = jest.fn();
    const mockOnAddStory = jest.fn();

    const mockStories = [
        {
            id: 's1',
            isu: 1,
            url: 'path/to/story1.jpg',
            expiration_date: Date.now() + 24 * 60 * 60 * 1000,
        },
        {
            id: 's2',
            isu: 2,
            url: 'path/to/story2.jpg',
            expiration_date: Date.now() + 24 * 60 * 60 * 1000,
        },
    ];

    const mockContacts = [
        {
            isu: 1,
            username: 'Alice',
            logo: 'path/to/alice.jpg'
        },
        {
            isu: 2,
            username: 'Bob',
            logo: 'path/to/bob.jpg'
        },
        {
            isu: 3,
            username: 'Charlie',
            logo: 'path/to/charlie.jpg'
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
        renderWithRouter(<Stories people={mockContacts} stories={mockStories} onAddStory={mockOnAddStory} />);

        // Check "Your Story" is rendered
        expect(screen.getByText('Your Story')).toBeInTheDocument();

        // Only contacts with stories should be rendered
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.queryByText('Charlie')).not.toBeInTheDocument(); // No story for Charlie
    });

    it('navigates to "/add-story" when "Your Story" is clicked', () => {
        renderWithRouter(<Stories people={mockContacts} stories={mockStories} onAddStory={mockOnAddStory} />);

        // Find add story btn
        const yourStoryButton = screen.getByRole('button', { name: /your story/i });

        // Click to open Add story page
        fireEvent.click(yourStoryButton);

        // Check mocked navigate
        expect(mockedNavigate).toHaveBeenCalledWith('/add-story');
        expect(logEvent).toHaveBeenCalledWith('Stories', 'Add story clicked', 'Add Story Button');
    });

    it('opens StoryViewer with correct initialIndex when a story is clicked', () => {
        renderWithRouter(<Stories people={mockContacts} stories={mockStories} onAddStory={mockOnAddStory} />);

        // Click on Alice's story
        const aliceElement = screen.getByText('Alice');
        const aliceStoryElement = aliceElement.parentElement;
        if (aliceStoryElement) {
            fireEvent.click(aliceStoryElement);
        }

        expect(screen.getByTestId('story-viewer')).toBeInTheDocument();
        expect(logEvent).toHaveBeenCalledWith('Stories', 'View story clicked', 'View Story Button');
    });

    it('closes StoryViewer when onClose is called', () => {
        renderWithRouter(<Stories people={mockContacts} stories={mockStories} onAddStory={mockOnAddStory} />);

        // Open StoryViewer by clicking on Alice's story
        const aliceElement = screen.getByText('Alice');
        const aliceStoryElement = aliceElement.parentElement;
        if (aliceStoryElement) {
            fireEvent.click(aliceStoryElement);
        }


        // Click the close button in StoryViewer
        const closeButton = screen.getByText('Close Story Viewer');
        fireEvent.click(closeButton);

        // Ensure StoryViewer is closed
        expect(screen.queryByTestId('story-viewer')).not.toBeInTheDocument();
    });
});
