import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditProfilePage from '../../src/components/pages/EditProfilePage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PremiumProvider } from '../../src/contexts/PremiumContext';
import PremiumPage from '../../src/components/pages/PremiumPage';
import { logEvent, logPageView } from '../../src/analytics';

jest.mock('../../src/analytics', () => ({
    logEvent: jest.fn(),
    logPageView: jest.fn(),
}));

describe('EditProfilePage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders EditProfilePage with all sections', () => {
        render(
            <PremiumProvider>
                <MemoryRouter initialEntries={['/edit-profile']}>
                    <EditProfilePage />
                </MemoryRouter>
            </PremiumProvider>
        );

        expect(screen.getByText('Alisa Pipisa, 20')).toBeInTheDocument();
        expect(screen.getByText('Bio')).toBeInTheDocument();
        expect(screen.getByText('Target')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Интересы/i })).toBeInTheDocument();
        expect(screen.getByText('Gallery')).toBeInTheDocument();
        expect(screen.getByText('Premium')).toBeInTheDocument();

        expect(logPageView).toHaveBeenCalledWith('/edit-profile');
    });

    test('opens and selects target option', async () => {
        render(
            <PremiumProvider>
                <MemoryRouter initialEntries={['/edit-profile']}>
                    <EditProfilePage />
                </MemoryRouter>
            </PremiumProvider>
        );

        fireEvent.click(screen.getByText('Romantic relationships'));
        fireEvent.click(screen.getByText('Dates'));
        fireEvent.click(screen.getByText('Сохранить'));

        await waitFor(() => {
            expect(screen.getByText('Dates')).toBeInTheDocument();
        });
    });

    test('opens and selects main feature option', async () => {
        render(
            <PremiumProvider>
                <MemoryRouter>
                    <EditProfilePage />
                </MemoryRouter>
            </PremiumProvider>
        );

        const heightButton = screen.getByRole('button', { name: /Height/i });
        fireEvent.click(heightButton);

        const heightValue = await screen.findByText('100');
        expect(heightValue).toBeInTheDocument();
    });

    test('selects interests', async () => {
        render(
            <PremiumProvider>
                <MemoryRouter initialEntries={['/edit-profile']}>
                    <EditProfilePage />
                </MemoryRouter>
            </PremiumProvider>
        );

        fireEvent.click(screen.getByText(/Добавьте свои интересы/i));
        fireEvent.click(screen.getByText(/Путешествия/i));
        fireEvent.click(screen.getByText(/Книги/i));
        fireEvent.click(screen.getByText(/Применить/i));

        await waitFor(() => {
            expect(screen.getByText(/Путешествия/i)).toBeInTheDocument();
            expect(screen.getByText(/Книги/i)).toBeInTheDocument();
        });
    });

    test('edits and deletes gallery images', async () => {
        render(
            <PremiumProvider>
                <MemoryRouter initialEntries={['/edit-profile']}>
                    <EditProfilePage />
                </MemoryRouter>
            </PremiumProvider>
        );

        const images = screen.getAllByRole('img');
        expect(images.length).toBe(3);

        const deleteButtons = screen.getAllByTestId('delete-button');
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(screen.getAllByRole('img').length).toBe(2);
        });
    });

    test('navigates back to profile page', async () => {
        render(
            <PremiumProvider>
                <MemoryRouter initialEntries={['/edit-profile']}>
                    <EditProfilePage />
                </MemoryRouter>
            </PremiumProvider>
        );

        fireEvent.click(screen.getByTestId('BackToProfile'));

        await waitFor(() => {
            expect(screen.getByTestId('location-display')).toHaveTextContent('/profile');
        });
    });

    test('navigates to premium page on Premium button click', async () => {
        render(
            <PremiumProvider>
                <MemoryRouter initialEntries={['/edit-profile']}>
                    <Routes>
                        <Route path="/edit-profile" element={<EditProfilePage />} />
                        <Route path="/premium" element={<PremiumPage />} />
                    </Routes>
                </MemoryRouter>
            </PremiumProvider>
        );

        fireEvent.click(screen.getByText('Premium'));

        await waitFor(() => {
            expect(screen.getByText('Это премиум. Вау!')).toBeInTheDocument();
        });

        expect(logEvent).toHaveBeenCalledWith('Profile', 'To premium click', 'Premium Button');
    });
});
