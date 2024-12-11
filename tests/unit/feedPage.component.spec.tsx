import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FeedPage } from '../../src/components/pages/FeedPage';
import '@testing-library/jest-dom';

const person1 = {
    isu: 1,
    logo: 'https://example.com/image.jpg',
    username: 'John Doe',
    bio: 'A sample person',
}
const person2 = {
    isu: 2,
    logo: 'https://example.com/image.jpg',
    username: 'John Doe2',
    bio: 'A sample person2',
}

describe('FeedPage', () => {
    let mockGetNextPerson: jest.Mock;
    let mockOnLike: jest.Mock;
    let mockOnSuperLike: jest.Mock;
    let mockOnDislike: jest.Mock;

    beforeEach(() => {
        mockGetNextPerson = jest.fn().mockReturnValueOnce(person1).mockReturnValueOnce(person2);
        mockOnLike = jest.fn();
        mockOnSuperLike = jest.fn();
        mockOnDislike = jest.fn();
    });

    it('renders the component correctly', () => {
        render(
            <FeedPage
                getNextPerson={mockGetNextPerson}
                onLike={mockOnLike}
                onSuperLike={mockOnSuperLike}
                onDislike={mockOnDislike}
            />
        );

        expect(mockGetNextPerson).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Search')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('A sample person')).toBeInTheDocument();
    });

    it('calls onLike when swiped right', async () => {
        render(
            <FeedPage
                getNextPerson={mockGetNextPerson}
                onLike={mockOnLike}
                onSuperLike={mockOnSuperLike}
                onDislike={mockOnDislike}
            />
        );

        const button = screen.getByTestId("FavoriteIcon");
        fireEvent.click(button);

        expect(mockOnLike).toHaveBeenCalledWith(person1);
        await waitFor(() => {
            expect(mockGetNextPerson).toHaveBeenCalledTimes(2);
            expect(screen.getByText('John Doe2')).toBeInTheDocument();
            expect(screen.getByText('A sample person2')).toBeInTheDocument();
        });
    });

    it('calls onDislike when swiped left', async () => {
        render(
            <FeedPage
                getNextPerson={mockGetNextPerson}
                onLike={mockOnLike}
                onSuperLike={mockOnSuperLike}
                onDislike={mockOnDislike}
            />
        );


        const button = screen.getByTestId("CloseIcon");
        fireEvent.click(button);

        expect(mockOnDislike).toHaveBeenCalledWith(person1);
        await waitFor(() => {
            expect(mockGetNextPerson).toHaveBeenCalledTimes(2);
            expect(screen.getByText('John Doe2')).toBeInTheDocument();
            expect(screen.getByText('A sample person2')).toBeInTheDocument();
        });
    });

    it('calls onSuperLike when swiped up', async () => {
        render(
            <FeedPage
                getNextPerson={mockGetNextPerson}
                onLike={mockOnLike}
                onSuperLike={mockOnSuperLike}
                onDislike={mockOnDislike}
            />
        );

        const button = screen.getByTestId("StarIcon");
        fireEvent.click(button);

        expect(mockOnSuperLike).toHaveBeenCalledWith(person1);
        await waitFor(() => {
            expect(mockGetNextPerson).toHaveBeenCalledTimes(2);
        });
    });

    it('opens and closes the drawer', async () => {
        render(
            <FeedPage
                getNextPerson={mockGetNextPerson}
                onLike={mockOnLike}
                onSuperLike={mockOnSuperLike}
                onDislike={mockOnDislike}
            />
        );

        const button = screen.getByTestId("MoreVertIcon");

        fireEvent.click(button);
        const text = screen.getByText('Filters');
        expect(text).toBeVisible();

        const button2 = screen.getAllByTestId("CloseIcon")[1];
        fireEvent.click(button2);
        await waitFor(() => {
            expect(text).not.toBeVisible();
        });
    });
});
