import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserProfilePage from '../../src/components/pages/UserProfilePage';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

const mockPeople = [
    {
        id: 1,
        name: 'Jane Smith1',
        imageUrl: 'https://steamuserimages-a.akamaihd.net/ugc/1844789643806854188/FB581EAD503907F56A009F85371F6FB09A467FEC/?imw=512&imh=497&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',
        photos: [
            'https://randomwordgenerator.com/img/picture-generator/54e7d7404853a914f1dc8460962e33791c3ad6e04e507440752972d29e4bc3_640.jpg',
            'https://randomwordgenerator.com/img/picture-generator/54e2d34b4a52aa14f1dc8460962e33791c3ad6e04e507749742c78d59e45cc_640.jpg',
        ],
        mainFeatures: [
            { text: '180 cm', icon: <span>📏</span> },
            { text: 'Atheism', icon: <span>🛐</span> },
        ],
        interests: [
            { text: 'Music', icon: <span>🎵</span> },
            { text: 'GYM', icon: <span>🏋️</span> },
        ],
        itmo: [
            { text: '1', icon: <span>⭐</span> },
            { text: 'PIiKT', icon: <span>💻</span> },
            { text: '123456', icon: <span>🆔</span> },
        ],
        isStudent: true,
    },
    {
        id: 2,
        name: 'Jane Smith2',
        imageUrl: 'https://i.pinimg.com/736x/56/21/7b/56217b1ef6a69a2583ff13655d48bc53.jpg',
        photos: [
            'https://randomwordgenerator.com/img/picture-generator/53e9d7444b50b10ff3d8992cc12c30771037dbf852547849752678d5964e_640.jpg',
        ],
        mainFeatures: [
            { text: '165 cm', icon: <span>📏</span> },
            { text: 'Catholicism', icon: <span>🛐</span> },
        ],
        interests: [
            { text: 'Traveling', icon: <span>✈️</span> },
        ],
        itmo: [],
        isStudent: false,
    },
];

const renderUserProfilePage = (id: string) => {
    render(
        <MemoryRouter initialEntries={[`/user-profile/${id}`]}>
            <Routes>
                <Route
                    path="/user-profile/:id"
                    element={<UserProfilePage people={mockPeople} />}
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
        expect(screen.getByText('Profile not found.')).toBeInTheDocument();
    });

    test('displays user details correctly', () => {
        renderUserProfilePage('1');
        expect(screen.getByText('Jane Smith1')).toBeInTheDocument();
        expect(screen.getByText('180 cm')).toBeInTheDocument();
        expect(screen.getByText('Atheism')).toBeInTheDocument();
        expect(screen.getByText('Music')).toBeInTheDocument();
        expect(screen.getByText('GYM')).toBeInTheDocument();
    });

    test('allows navigation between photos', () => {
        renderUserProfilePage('1');
        const nextPhotoButton = screen.getByLabelText('Next Photo');
        const prevPhotoButton = screen.getByLabelText('Previous Photo');

        expect(screen.getByAltText('Jane Smith1 photo 1')).toBeInTheDocument();

        fireEvent.click(nextPhotoButton);
        expect(screen.getByAltText('Jane Smith1 photo 2')).toBeInTheDocument();

        fireEvent.click(prevPhotoButton);
        expect(screen.getByAltText('Jane Smith1 photo 1')).toBeInTheDocument();
    });

    test('displays ITMO details if the user is a student', () => {
        renderUserProfilePage('1');
        expect(screen.getByText('LVL: 1')).toBeInTheDocument();
        expect(screen.getByText('Faculty: PIiKT')).toBeInTheDocument();
        expect(screen.getByText('ITMO ID: 123456')).toBeInTheDocument();
    });

    test('shows non-student message for non-student users', () => {
        renderUserProfilePage('2');
        expect(screen.getByText('Person not a student ;c')).toBeInTheDocument();
    });

    test('calls block user functionality when "Block user" is clicked', () => {
        renderUserProfilePage('1');
        const blockButton = screen.getByRole('button', { name: /Block user/i });
        fireEvent.click(blockButton);
        expect(console.log).toHaveBeenCalledWith('User blocked');
    });

    test('navigates back when "Go Back" is clicked', () => {
        renderUserProfilePage('1');
        const backButton = screen.getByRole('button', { name: /go back/i });
        fireEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});