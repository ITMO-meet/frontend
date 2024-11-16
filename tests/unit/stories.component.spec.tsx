// tests/unit/stories.component.spec.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Stories from '../../src/components/Stories';
import '@testing-library/jest-dom';
import { Contact } from '../../src/types';
import { fetchStories } from '../../src/api/apiClient';
import { StoryViewerProps } from '../../src/components/StoryViewer';

jest.mock('../../src/api/apiClient');

// Мокаем компонент StoryViewer
jest.mock('../../src/components/StoryViewer', () => {

    const MockStoryViewer: React.FC<StoryViewerProps> = (props: StoryViewerProps) => (
        <div data-testid="story-viewer">
            <button onClick={props.onClose}>Close Story Viewer</button>
        </div>
    );
    return {
        __esModule: true,
        default: MockStoryViewer,
    };
});

describe('Stories Component', () => {
    const mockContacts: Contact[] = [
        {
            id: 1,
            name: 'Alice',
            pfp: 'path/to/alice.jpg',
            stories: [],
        },
        {
            id: 2,
            name: 'Bob',
            pfp: 'path/to/bob.jpg',
            stories: [],
        },
    ];

    const mockOnAddStory = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (fetchStories as jest.MockedFunction<typeof fetchStories>).mockResolvedValue(mockContacts);
    });

    it('рендерит компонент и загружает истории', async () => {
        await act(async () => {
            render(<Stories onAddStory={mockOnAddStory} />);
        });

        expect(screen.getByText('Your Story')).toBeInTheDocument();

        await waitFor(() => expect(fetchStories).toHaveBeenCalled());

        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('открывает StoryViewer при клике на историю', async () => {
        await act(async () => {
            render(<Stories onAddStory={mockOnAddStory} />);
        });

        await waitFor(() => expect(fetchStories).toHaveBeenCalled());

        const aliceStory = screen.getByText('Alice');
        fireEvent.click(aliceStory);

        expect(screen.getByTestId('story-viewer')).toBeInTheDocument();
    });

    it('закрывает StoryViewer при вызове onClose', async () => {
        await act(async () => {
            render(<Stories onAddStory={mockOnAddStory} />);
        });

        await waitFor(() => expect(fetchStories).toHaveBeenCalled());

        const bobStory = screen.getByText('Bob');
        fireEvent.click(bobStory);

        expect(screen.getByTestId('story-viewer')).toBeInTheDocument();

        const closeButton = screen.getByText('Close Story Viewer');
        fireEvent.click(closeButton);

        expect(screen.queryByTestId('story-viewer')).not.toBeInTheDocument();
    });


});
