import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import StoryViewer from '../../src/components/StoryViewer';
describe('StoryViewer Component', () => {
    const mockContacts = [
        {
            id: '1',
            name: 'John Doe',
            pfp: 'path/to/avatar1.jpg',
            stories: [
                {
                    id: '1',
                    image: 'path/to/story1.jpg',
                    expiresAt: Date.now() + 24 * 60 * 60 * 1000
                },
                {
                    id: '1',
                    image: 'path/to/story2.jpg',
                    expiresAt: Date.now() + 24 * 60 * 60 * 1000
                },
            ],
        },
        {
            id: '2',
            name: 'Jane Smith',
            pfp: 'path/to/avatar2.jpg',
            stories: [
                {
                    id: '1',
                    image: 'path/to/story3.jpg',
                    expiresAt: Date.now() + 24 * 60 * 60 * 1000
                },
                {
                    id: '1',
                    image: 'path/to/story4.jpg',
                    expiresAt: Date.now() + 24 * 60 * 60 * 1000
                },
            ],
        },
    ];

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
        render(<StoryViewer contacts={mockContacts} initialIndex={0} onClose={onClose} />);

        expect(screen.getByAltText('Story')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getAllByRole('progressbar')).toHaveLength(2);
    });

    it('automatically advances to next story when progress completes', () => {
        const onClose = jest.fn();
        render(<StoryViewer contacts={mockContacts} initialIndex={0} onClose={onClose} />);

        expect(screen.getByAltText('Story')).toHaveAttribute('src', 'path/to/story1.jpg');

        act(() => {
            jest.advanceTimersByTime(6500);
        });

        act(() => { });

        expect(screen.getByAltText('Story')).toHaveAttribute('src', 'path/to/story2.jpg');
    });

    it('advances to next story when right area is clicked', () => {
        const onClose = jest.fn();
        render(<StoryViewer contacts={mockContacts} initialIndex={0} onClose={onClose} />);

        expect(screen.getByAltText('Story')).toHaveAttribute('src', 'path/to/story1.jpg');

        const rightClickArea = screen.getByTestId('right-click-area');
        fireEvent.click(rightClickArea);

        act(() => { });

        expect(screen.getByAltText('Story')).toHaveAttribute('src', 'path/to/story2.jpg');
    });

    it('goes to previous story when left area is clicked', () => {
        const onClose = jest.fn();
        render(<StoryViewer contacts={mockContacts} initialIndex={0} onClose={onClose} />);

        act(() => {
            jest.advanceTimersByTime(6500);
        });

        act(() => { });

        expect(screen.getByAltText('Story')).toHaveAttribute('src', 'path/to/story2.jpg');

        const leftClickArea = screen.getByTestId('left-click-area');
        fireEvent.click(leftClickArea);

        act(() => { });

        expect(screen.getByAltText('Story')).toHaveAttribute('src', 'path/to/story1.jpg');
    });

    it('calls onClose when Close button is clicked', () => {
        const onClose = jest.fn();
        render(<StoryViewer contacts={mockContacts} initialIndex={0} onClose={onClose} />);

        const closeButton = screen.getByTestId('close-button');
        fireEvent.click(closeButton);

        expect(onClose).toHaveBeenCalled();
    });

    it('pauses and resumes the progress when image is pressed and released', () => {
        const onClose = jest.fn();
        render(<StoryViewer contacts={mockContacts} initialIndex={0} onClose={onClose} />);

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        const image = screen.getByAltText('Story');
        fireEvent.mouseDown(image);

        const currentStory = screen.getByAltText('Story').getAttribute('src');

        act(() => {
            jest.advanceTimersByTime(6000);
        });

        act(() => { });

        expect(screen.getByAltText('Story')).toHaveAttribute('src', currentStory);

        fireEvent.mouseUp(image);

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        act(() => { });

        expect(screen.getByAltText('Story')).toHaveAttribute('src', currentStory);
    });

    it('advances to next contact\'s stories after finishing current contact\'s stories', () => {
        const onClose = jest.fn();
        render(<StoryViewer contacts={mockContacts} initialIndex={0} onClose={onClose} />);

        act(() => {
            jest.advanceTimersByTime(6500);
        });

        act(() => { });

        expect(screen.getByAltText('Story')).toHaveAttribute('src', 'path/to/story2.jpg');
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('renders correct number of progress bars for current contact', () => {
        const onClose = jest.fn();
        render(<StoryViewer contacts={mockContacts} initialIndex={1} onClose={onClose} />);

        expect(screen.getAllByRole('progressbar')).toHaveLength(2);
    });

    it('calls onClose when clicking previous on first story of first contact', () => {
        const onClose = jest.fn();
        render(<StoryViewer contacts={mockContacts} initialIndex={0} onClose={onClose} />);

        expect(screen.getByAltText('Story')).toHaveAttribute('src', 'path/to/story1.jpg');

        const leftClickArea = screen.getByTestId('left-click-area');
        fireEvent.click(leftClickArea);

        expect(onClose).toHaveBeenCalled();
    });

    it('goes to last story of previous contact when clicking previous on first story of a contact', () => {
        const onClose = jest.fn();
        render(<StoryViewer contacts={mockContacts} initialIndex={1} onClose={onClose} />);

        expect(screen.getByAltText('Story')).toHaveAttribute('src', 'path/to/story3.jpg');

        const leftClickArea = screen.getByTestId('left-click-area');
        fireEvent.click(leftClickArea);

        act(() => { });

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByAltText('Story')).toHaveAttribute('src', 'path/to/story2.jpg');
    });
});
