import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

const StoryViewerMock = jest.fn((props) => (
    <div data-testid="story-viewer">
        <button onClick={props.onClose}>Close Story Viewer</button>
    </div>
));

jest.mock('../../src/components/StoryViewer', () => ({
    __esModule: true,
    default: StoryViewerMock,
}));

import Stories from '../../src/components/Stories';

describe('Stories Component', () => {
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
    });

    it('renders "Your Story" and contacts with stories', () => {
        render(<Stories contacts={mockContacts} onAddStory={mockOnAddStory} />);

        // Check "Your Story" is rendered
        expect(screen.getByText('Your Story')).toBeInTheDocument();

        // Only contacts with stories should be rendered
        expect(screen.queryByText('Alice')).not.toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    it('calls onAddStory when "Your Story" is clicked', () => {
        render(<Stories contacts={mockContacts} onAddStory={mockOnAddStory} />);

        // Assuming the first IconButton is the "Your Story" button
        const iconButtons = screen.getAllByRole('button');
        const yourStoryIconButton = iconButtons[0];

        // Simulate clicking "Your Story"
        fireEvent.click(yourStoryIconButton);

        expect(mockOnAddStory).toHaveBeenCalled();
    });

    it('opens StoryViewer with correct initialIndex when a story is clicked', () => {
        render(<Stories contacts={mockContacts} onAddStory={mockOnAddStory} />);

        // Click on Bob's story
        const bobNameElement = screen.getByText('Bob');
        const bobStoryElement = bobNameElement.parentElement;
        if (bobStoryElement) {
            fireEvent.click(bobStoryElement);
        }

        // StoryViewer should open
        expect(screen.getByTestId('story-viewer')).toBeInTheDocument();

        // Expect StoryViewer to have been called with initialIndex = 0
        expect(StoryViewerMock).toHaveBeenCalledWith(
            expect.objectContaining({ initialIndex: 0 }),
            expect.anything()
        );

        // Click on Charlie's story
        const charlieNameElement = screen.getByText('Charlie');
        const charlieStoryElement = charlieNameElement.parentElement;
        if (charlieStoryElement) {
            fireEvent.click(charlieStoryElement);
        }

        // Expect StoryViewer to have been called with initialIndex = 1
        expect(StoryViewerMock).toHaveBeenLastCalledWith(
            expect.objectContaining({ initialIndex: 1 }),
            expect.anything()
        );
    });

    it('closes StoryViewer when onClose is called', () => {
        render(<Stories contacts={mockContacts} onAddStory={mockOnAddStory} />);

        // Open StoryViewer by clicking on Bob's story
        const bobNameElement = screen.getByText('Bob');
        const bobStoryElement = bobNameElement.parentElement;
        if (bobStoryElement) {
            fireEvent.click(bobStoryElement);
        }

        // Ensure StoryViewer is open
        expect(screen.getByTestId('story-viewer')).toBeInTheDocument();

        // Click the close button in StoryViewer
        const closeButton = screen.getByText('Close Story Viewer');
        fireEvent.click(closeButton);

        // Ensure StoryViewer is closed
        expect(screen.queryByTestId('story-viewer')).not.toBeInTheDocument();
    });
});
