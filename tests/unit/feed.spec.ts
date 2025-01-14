import {
    getRandomPerson,
} from '../../src/api/feed';
import * as apiIndex from '../../src/api/index';

jest.mock('../../src/api/index', () => ({
    __esModule: true,
    getJson: jest.fn(),
}));

describe('profile API', () => {
    const mockGetJson = apiIndex.getJson as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('getRandomPerson calls getJson with correct isu', async () => {
        const mockPerson = {
            _id: '1',
            isu: 123456,
            username: 'testuser',
            bio: 'This is a bio',
            logo: 'logo.png',
            photos: ['photo1.png'],
            mainFeatures: [],
            interests: [],
            itmo: [],
            gender_preferences: [],
            relationship_preferences: [],
            isStudent: false,
            selected_preferences: [],
        };
        mockGetJson.mockResolvedValue({ profile: mockPerson });
        const result = await getRandomPerson(123456);
        expect(mockGetJson).toHaveBeenCalledWith('/matches/random_person?user_id=123456');
        expect(result).toEqual(mockPerson);
    });
});
