import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import StoryViewer from '../../src/components/StoryViewer';
import { logEvent, logPageView } from '../../src/analytics'

jest.mock('../../src/analytics', () => ({
    logEvent: jest.fn(),
    logPageView: jest.fn(),
}));

describe('StoryViewer Component', () => {
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

    const storiesWithContent = mockStories.map((story) => {
        const person = mockContacts.find((contact) => contact.isu === story.isu);
        return person
            ? { story, person }
            : null;
    }).filter((entry): entry is { story: typeof mockStories[0]; person: typeof mockContacts[0] } => entry !== null);

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    it('renders the component with initial story', () => {
        const onClose = jest.fn();
        render(<StoryViewer storiesWithContent={storiesWithContent} initialIndex={0} onClose={onClose} />);

        expect(screen.getByAltText('Story')).toBeInTheDocument();
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getAllByRole('progressbar')).toHaveLength(2);

        expect(logEvent).toHaveBeenCalledWith('Story', 'Story viewed', '');
    });

    it('automatically advances to next story when progress completes', () => {
        const onClose = jest.fn();
        render(<StoryViewer storiesWithContent={storiesWithContent} initialIndex={0} onClose={onClose} />);

        expect(screen.getByAltText('Story')).toHaveAttribute('src', 'path/to/story1.jpg');

        act(() => {
            jest.advanceTimersByTime(6500);
        });


        expect(screen.getByAltText('Story')).toHaveAttribute('src', 'path/to/story2.jpg');
        
        expect(logEvent).toHaveBeenCalledWith('Story', 'Story viewed', '');
    });

    it('advances to next story when right area is clicked', () => {
        const onClose = jest.fn();
        render(<StoryViewer storiesWithContent={storiesWithContent} initialIndex={0} onClose={onClose} />);

        expect(screen.getByAltText('Story')).toHaveAttribute('src', 'path/to/story1.jpg');

        const rightClickArea = screen.getByTestId('right-click-area');
        fireEvent.click(rightClickArea);


        expect(screen.getByAltText('Story')).toHaveAttribute('src', 'path/to/story2.jpg');

        expect(logEvent).toHaveBeenCalledWith('Story', 'Story viewed', '');
    });

    it('goes to previous story when left area is clicked', () => {
        const onClose = jest.fn();
        render(<StoryViewer storiesWithContent={storiesWithContent} initialIndex={1} onClose={onClose} />);

        expect(screen.getByAltText('Story')).toHaveAttribute('src', 'path/to/story2.jpg');

        const leftClickArea = screen.getByTestId('left-click-area');
        fireEvent.click(leftClickArea);

        expect(screen.getByAltText('Story')).toHaveAttribute('src', 'path/to/story1.jpg');

        expect(logEvent).toHaveBeenCalledWith('Story', 'Story viewed', '');
    });

    it('calls onClose when Close button is clicked', () => {
        const onClose = jest.fn();
        render(<StoryViewer storiesWithContent={storiesWithContent} initialIndex={0} onClose={onClose} />);

        const closeButton = screen.getByTestId('close-button');
        fireEvent.click(closeButton);

        expect(onClose).toHaveBeenCalled();

        expect(logEvent).toHaveBeenCalledWith('Story', 'Story viewed', '');
    });

    it('pauses and resumes the progress when image is pressed and released', () => {
        const onClose = jest.fn();
        render(<StoryViewer storiesWithContent={storiesWithContent} initialIndex={0} onClose={onClose} />);

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        const image = screen.getByAltText('Story');
        fireEvent.mouseDown(image);

        const currentStory = screen.getByAltText('Story').getAttribute('src');

        act(() => {
            jest.advanceTimersByTime(6000);
        });


        expect(screen.getByAltText('Story')).toHaveAttribute('src', currentStory);

        fireEvent.mouseUp(image);

        act(() => {
            jest.advanceTimersByTime(1000);
        });


        expect(screen.getByAltText('Story')).toHaveAttribute('src', currentStory);

        expect(logEvent).toHaveBeenCalledWith('Story', 'Story viewed', '');
    });
});
