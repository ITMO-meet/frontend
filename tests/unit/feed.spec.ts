import { likePerson, dislikePerson, superLikePerson, getFilteredPerson } from '../../src/api/feed';
import * as apiIndex from '../../src/api/index';

jest.mock('../../src/api/index', () => ({
    __esModule: true,
    getJson: jest.fn(),
    postJson: jest.fn(),
}));

describe('profile API', () => {
    const mockGetJson = apiIndex.getJson as jest.Mock;
    const mockPostJson = apiIndex.postJson as jest.Mock;

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

        const userIsu = 123456
        const gender = "Everyone"
        const ageRange = [0, 100]
        const heightRange = [0, 100]
        const relPrefs: string[] = [];

        mockGetJson.mockResolvedValue({ profile: mockPerson });
        const result = await getFilteredPerson(userIsu,gender,ageRange,heightRange,relPrefs);
        expect(mockGetJson).toHaveBeenCalledWith('/matches/random_persona?user_id=123456&gender=Everyone&min_age=0&max_age=100&min_height=0&max_height=100');
        expect(result).toEqual({ profile: mockPerson });
    });

    it('likePerson should call postJson with the correct endpoint and payload', async () => {
        const expectedResponse = { message: 'liked', matched: true, chat_id: 'chat123' };
        mockPostJson.mockResolvedValue(expectedResponse);

        const result = await likePerson(1, 2);

        expect(mockPostJson).toHaveBeenCalledWith(
            '/matches/like_person/',
            { user_id: 1, target_id: 2 }
        );
        expect(result).toEqual(expectedResponse);
    });

    it('dislikePerson should call postJson with the correct endpoint and payload', async () => {
        const expectedResponse = { message: 'disliked' };
        mockPostJson.mockResolvedValue(expectedResponse);

        const result = await dislikePerson(1, 2);

        expect(mockPostJson).toHaveBeenCalledWith(
            '/matches/dislike_person',
            { user_id: 1, target_id: 2 }
        );
        expect(result).toEqual(expectedResponse);
    });

    it('superLikePerson should call postJson with the correct endpoint and payload', async () => {
        const expectedResponse = { message: 'super liked', matched: true, chat_id: 'chat456' };
        mockPostJson.mockResolvedValue(expectedResponse);

        const result = await superLikePerson(1, 2);

        expect(mockPostJson).toHaveBeenCalledWith(
            '/matches/superlike_person',
            { user_id: 1, target_id: 2 }
        );
        expect(result).toEqual(expectedResponse);
    });
});
