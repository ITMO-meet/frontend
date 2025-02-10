// tests/unit/stories.spec.ts
import { createStory, getStory, getUserStories, CreateStoryResponse, GetStoryResponse, GetUserStoriesResponse } from '../../src/api/stories';
import { getJson, request } from '../../src/api/index';

jest.mock('../../src/api/index', () => ({
    __esModule: true,
    getJson: jest.fn(),
    request: jest.fn(),
}));

describe('stories.ts API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createStory', () => {
        it('should call request with FormData and return CreateStoryResponse', async () => {
            const fakeResponse = {
                json: async () => ({ expDate: 1234567890, id: 'story1' }),
            };
            (request as jest.Mock).mockResolvedValue(fakeResponse);
            const fakeFile = new File(["content"], "story.jpg", { type: "image/jpeg" });
            const result: CreateStoryResponse = await createStory(42, fakeFile);
            expect(request).toHaveBeenCalledWith('/stories/create_story', expect.objectContaining({
                method: 'POST',
                body: expect.any(FormData),
            }));
            expect(result).toEqual({ expDate: 1234567890, id: 'story1' });
        });
    });

    describe('getStory', () => {
        it('should call getJson with correct URL and return GetStoryResponse', async () => {
            const fakeStory: GetStoryResponse = {
                id: 'story1',
                isu: 42,
                url: 'http://example.com/story1.jpg',
                expiration_date: 1234567890,
            };
            (getJson as jest.Mock).mockResolvedValue(fakeStory);
            const result: GetStoryResponse = await getStory('story1');
            expect(getJson).toHaveBeenCalledWith('/stories/get_story/story1');
            expect(result).toEqual(fakeStory);
        });
    });

    describe('getUserStories', () => {
        it('should call getJson with correct URL and return GetUserStoriesResponse', async () => {
            const fakeResponse: GetUserStoriesResponse = {
                stories: ['story1', 'story2'],
            };
            (getJson as jest.Mock).mockResolvedValue(fakeResponse);
            const result: GetUserStoriesResponse = await getUserStories(42);
            expect(getJson).toHaveBeenCalledWith('/stories/get_user_stories/42');
            expect(result).toEqual(fakeResponse);
        });
    });
});
