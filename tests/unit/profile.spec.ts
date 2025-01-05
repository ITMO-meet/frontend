import {
    getProfile,
    updateBio,
    updateUsername,
    updateHeight,
    updateWeight,
    updateZodiac,
} from '../../src/api/profile';
import * as apiIndex from '../../src/api/index';

jest.mock('../../src/api/index', () => ({
    __esModule: true,
    getJson: jest.fn(),
    putJson: jest.fn(),
}));

describe('profile API', () => {
    const mockGetJson = apiIndex.getJson as jest.Mock;
    const mockPutJson = apiIndex.putJson as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('getProfile calls getJson with correct isu', async () => {
        const mockProfile = {
            profile: {
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
            },
        };
        mockGetJson.mockResolvedValue(mockProfile);
        const result = await getProfile(123456);
        expect(mockGetJson).toHaveBeenCalledWith('/profile/get_profile/123456');
        expect(result).toEqual(mockProfile.profile);
    });

    it('updateBio calls putJson with correct data', async () => {
        await updateBio(123456, 'New bio');
        expect(mockPutJson).toHaveBeenCalledWith('/profile/update_bio/123456?bio=New bio');
    });

    it('updateUsername calls putJson with correct data', async () => {
        await updateUsername(123456, 'newusername');
        expect(mockPutJson).toHaveBeenCalledWith('/profile/update_username', { isu: 123456, username: 'newusername' });
    });

    it('updateHeight calls putJson with correct data', async () => {
        await updateHeight(123456, 180);
        expect(mockPutJson).toHaveBeenCalledWith('/profile/update_height/123456?height=180');
    });

    it('updateWeight calls putJson with correct data', async () => {
        await updateWeight(123456, 75);
        expect(mockPutJson).toHaveBeenCalledWith('/profile/update_weight/123456?weight=75');
    });

    it('updateZodiac calls putJson with correct data', async () => {
        await updateZodiac(123456, 'Aquarius');
        expect(mockPutJson).toHaveBeenCalledWith('/profile/update_zodiac/123456?zodiac=Aquarius');
    });
});
