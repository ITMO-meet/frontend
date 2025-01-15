import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserProfilePage from '../../src/components/pages/UserProfilePage';
import { useNavigate } from 'react-router-dom';
import { logEvent } from '../../src/analytics'
import { userProfileStore } from '../../src/stores/UserProfileStore';
import { Profile } from '../../src/api/profile';
jest.mock('../../src/analytics', () => ({
    logEvent: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock('../../src/stores/UserProfileStore', () => ({
    userProfileStore: {
        profile: null,
        loadProfile: jest.fn(),
        clearProfile: jest.fn(),
    },
}));

jest.mock('../../src/api/matches', () => ({
    blockPerson: jest.fn(() => Promise.resolve()),
}));

export const user: Profile = {
    _id: "abc123",
    isu: 123456,
    username: "Jane Smith1",
    bio: "Test bio for User1",
    logo: "https://example.com/logo.jpg",
    photos: [
        "https://example.com/photo1.jpg",
        "https://example.com/photo2.jpg",
    ],
    mainFeatures: [
        { icon: "height", text: "180 cm", map: {} },
        { icon: "weight", text: "65 kg", map: {} },
        { icon: "zodiac_sign", text: "♈️", map: {} },
        { icon: "gender", text: "Female", map: {} },
        { icon: "birthdate", text: "1990-01-01", map: {} },
        { icon: "worldview", text: "Atheism", map: {} },
        { icon: "children", text: "None", map: {} },
        { icon: "alcohol", text: "Occasionally", map: {} },
        { icon: "smoking", text: "No", map: {} },
        { icon: "languages", text: "English", map: {} },
        { icon: "languages", text: "Russian", map: {} },
    ],
    interests: [
        { icon: "music", text: "Music" },
        { icon: "gym", text: "GYM" }
    ],
    itmo: [
        { icon: "course", text: "1" },
        { icon: "faculty", text: "PIiKT" }
    ],
    gender_preferences: [
        { icon: "gender", text: "Male" }
    ],
    relationship_preferences: [
        { icon: "relationship", id: "1", text: "Long-term" }
    ],
    isStudent: true,
    selected_preferences: [
        { id: "1", text: "Preference1", icon: "pref" }
    ]
};

const renderUserProfilePage = (id: string) => {
    render(
        <MemoryRouter initialEntries={[`/user-profile/${id}`]}>
            <Routes>
                <Route
                    path="/user-profile/:id"
                    element={<UserProfilePage />}
                />
            </Routes>
        </MemoryRouter>
    );
};

describe('UserProfilePage', () => {
    beforeAll(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterAll(() => {
        (console.log as jest.Mock).mockRestore();
    });

    beforeEach(() => {
        mockNavigate.mockClear();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    })


    test('displays "Profile not found" if user does not exist', () => {
        renderUserProfilePage('999');
        expect(screen.getByText('Профиль не найден.')).toBeInTheDocument();

        expect(logEvent).toHaveBeenCalledWith('UserProfile', 'User profile viewed', '');
    });

    test('displays user details correctly', () => {
        userProfileStore.profile = user;

        renderUserProfilePage('123456');
        expect(screen.getByText('Jane Smith1')).toBeInTheDocument();
        expect(screen.getByText('180 cm')).toBeInTheDocument();
        expect(screen.getByText('Atheism')).toBeInTheDocument();
        expect(screen.getByText('Music')).toBeInTheDocument();
        expect(screen.getByText('GYM')).toBeInTheDocument();
        expect(screen.getByText('Test bio for User1')).toBeInTheDocument();
    });

    test('allows navigation between photos', () => {
        userProfileStore.profile = user;

        renderUserProfilePage('123456');
        const nextPhotoButton = screen.getByLabelText('Next Photo');
        const prevPhotoButton = screen.getByLabelText('Previous Photo');

        expect(screen.getByAltText('Jane Smith1 photo 1')).toBeInTheDocument();

        fireEvent.click(nextPhotoButton);
        expect(screen.getByAltText('Jane Smith1 photo 2')).toBeInTheDocument();

        fireEvent.click(prevPhotoButton);
        expect(screen.getByAltText('Jane Smith1 photo 1')).toBeInTheDocument();

    });

    test('displays ITMO details if the user is a student', () => {
        userProfileStore.profile = user;

        renderUserProfilePage('123456');
        expect(screen.getByText('Course: 1')).toBeInTheDocument();
        expect(screen.getByText('Faculty: PIiKT')).toBeInTheDocument();
        expect(screen.getByText('ITMO ID: 123456')).toBeInTheDocument();

        expect(logEvent).toHaveBeenCalledWith('UserProfile', 'User profile viewed', '');
    });

    test('shows non-student message for non-student users', () => {
        userProfileStore.profile = { ...user, isStudent: false };

        renderUserProfilePage('789852');
        expect(screen.getByText('Этот человек не является студентом.')).toBeInTheDocument();

        expect(logEvent).toHaveBeenCalledWith('UserProfile', 'User profile viewed', '');
    });

    test('calls block user functionality when "Block user" is clicked', async () => {
        userProfileStore.profile = user;

        renderUserProfilePage('123456');
        const blockButton = screen.getByRole('button', { name: /заблокировать пользователя/i });
        fireEvent.click(blockButton);

        const confirmButton = screen.getByRole('button', { name: /заблокировать/i });
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/matches');
        });
        expect(logEvent).toHaveBeenCalledWith('UserProfile', 'User profile viewed', '');
    });

    test('navigates back when "Go Back" is clicked', () => {
        userProfileStore.profile = user;

        renderUserProfilePage('123456');
        const backButton = screen.getByLabelText('Go back');
        fireEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledWith(-1);

        expect(logEvent).toHaveBeenCalledWith('UserProfile', 'User profile viewed', '');
    });
});
