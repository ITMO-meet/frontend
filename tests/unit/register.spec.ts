// tests/unit/register.spec.ts
import {
    selectUsername,
    selectPreferences,
    selectTags,
    uploadLogo,
    uploadCarousel,
    selectRelationship,
    fetchTags,
    fetchPreferences,
    profileDetails,
} from '../../src/api/register';
import * as apiIndex from '../../src/api/index';
import {any} from "prop-types";

jest.mock('../../src/api/index', () => ({
    __esModule: true,
    postJson: jest.fn(),
    postForm: jest.fn(),
    getJson: jest.fn(),
}));

jest.mock('../../src/stores/UserDataStore', () => ({
    userData: {
        loading: false,
        getIsu: jest.fn().mockReturnValue(1),
        getUsername: jest.fn().mockReturnValue("Alisa Pipisa"),
        getBio: jest.fn().mockReturnValue("Test Bio"),
        getBirthdate: jest.fn().mockReturnValue("2000-01-01"),
        getAge: jest.fn().mockReturnValue(20),
        getWeight: jest.fn().mockReturnValue(70),
        getHeight: jest.fn().mockReturnValue(100),
        getZodiac: jest.fn().mockReturnValue("Capricorn"),
        getGenderPreference: jest.fn().mockReturnValue("Everyone"),
        getRelationshipPreferenceId: jest.fn().mockReturnValue("672b44eab151637e969889bc"),
        getWorldview: jest.fn().mockReturnValue("World"),
        getChildren: jest.fn().mockReturnValue("Children"),
        getLanguages: jest.fn().mockReturnValue(["Russian"]),
        getAlcohol: jest.fn().mockReturnValue("Ok"),
        getSmoking: jest.fn().mockReturnValue("Ok"),
        getInterests: jest.fn().mockReturnValue(["Reading", "Traveling", "Cooking"]),
        getInterestIDs: jest.fn().mockReturnValue([""]),
        // Добавьте другие методы по мере необходимости
        setInterests: jest.fn(),
        updatePhotos: jest.fn(),
        setRelationshipPreferenceId: jest.fn(),
        getPhoto: jest.fn(),
        getAdditionalPhotos: jest.fn().mockReturnValue(["https://example.com/photo1.png", "https://example.com/photo2.png"]),
        getGender: jest.fn()
    }
}));

describe('register API', () => {
    const mockPostJson = apiIndex.postJson as jest.Mock;
    const mockPostForm = apiIndex.postForm as jest.Mock;
    const mockGetJson = apiIndex.getJson as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('selectUsername calls postJson with correct data', async () => {
        mockPostJson.mockResolvedValue({});
        await selectUsername({ isu: 123456, username: 'testuser' });
        expect(mockPostJson).toHaveBeenCalledWith('/auth/register/select_username', { isu: 123456, username: 'testuser' });
    });

    it('profileDetails calls postJson with correct data', async () => {
        mockPostJson.mockResolvedValue({});
        const profileData = {
            isu: 123456,
            bio: 'Hello, I am a test user.',
            height: 175,
            weight: 70,
            zodiac_sign: 'Aquarius'
        };

        await profileDetails(profileData);
        expect(mockPostJson).toHaveBeenCalledWith('/auth/register/profile_details', profileData);
    });

    it('selectPreferences calls postJson with correct data', async () => {
        mockPostJson.mockResolvedValue({});
        await selectPreferences({ isu: 123456, gender_preference: 'female' });
        expect(mockPostJson).toHaveBeenCalledWith('/auth/register/select_preferences', { isu: 123456, gender_preference: 'female' });
    });

    it('selectTags calls postJson with correct data', async () => {
        mockPostJson.mockResolvedValue({});
        await selectTags({ isu: 123456, tags: ['music','gym'] });
        expect(mockPostJson).toHaveBeenCalledWith('/auth/register/select_tags', { isu: 123456, tags: ['music','gym'] });
    });

    it('uploadLogo calls postForm with correct data', async () => {
        mockPostForm.mockResolvedValue(any);
        mockGetJson.mockResolvedValue({profile: {}});
        const file = new File(['dummy'], 'logo.png');
        await uploadLogo(123456, file);
        expect(mockPostForm).toHaveBeenCalledTimes(1);
        expect(mockPostForm.mock.calls[0][0]).toBe('/auth/register/upload_logo?isu=123456');
        // We can’t easily check the form contents, but we know it appended the file
    });

    it('uploadCarousel calls postForm with multiple files', async () => {
        mockPostForm.mockResolvedValue({any});
        mockGetJson.mockResolvedValue({profile: {}});
        const files = [new File(['dummy1'], 'p1.png'), new File(['dummy2'], 'p2.png')];
        await uploadCarousel(123456, files);
        expect(mockPostForm).toHaveBeenCalledTimes(1);
        expect(mockPostForm.mock.calls[0][0]).toBe('/auth/register/upload_carousel?isu=123456');
    });

    it('selectRelationship calls postJson with correct data', async () => {
        mockPostJson.mockResolvedValue({});
        await selectRelationship({ isu: 123456, relationship_preference: ['friendship'] });
        expect(mockPostJson).toHaveBeenCalledWith('/auth/register/select_relationship', { isu: 123456, relationship_preference: ['friendship'] });
    });

    it('fetchTags calls getJson and transforms result', async () => {
        mockGetJson.mockResolvedValue([
            { id: 'tag1', text: 'Music', icon: 'tag' },
            { id: 'tag2', text: 'Gym', icon: 'tag' },
        ]);
        const result = await fetchTags();
        expect(mockGetJson).toHaveBeenCalledWith('/tags');
        expect(result).toEqual([
            { id: 'tag1', text: 'Music', icon: 'tag' },
            { id: 'tag2', text: 'Gym', icon: 'tag' },
        ]);
    });

    it('fetchPreferences calls getJson and transforms result', async () => {
        mockGetJson.mockResolvedValue({
            preferences: [
                { id: 'pref1', text: 'Friendship', icon: 'relationship_preferences' },
                { id: 'pref2', text: 'Dating', icon: 'relationship_preferences' },
            ]
        });
        const result = await fetchPreferences();
        expect(mockGetJson).toHaveBeenCalledWith('/preferences');
        expect(result).toEqual([
            { id: 'pref1', text: 'Friendship', icon: 'relationship_preferences' },
            { id: 'pref2', text: 'Dating', icon: 'relationship_preferences' },
        ]);
    });


});
