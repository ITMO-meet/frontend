import { blockPerson, getUserChats } from '../../src/api/matches';
import * as apiIndex from '../../src/api/index';

jest.mock('../../src/api/index', () => ({
    __esModule: true,
    getJson: jest.fn(),
    postJson: jest.fn(),
}));

describe('matches API', () => {
    const mockGetJson = apiIndex.getJson as jest.Mock;
    const mockPostJson = apiIndex.postJson as jest.Mock;


    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('get user chats call with correct data', async () => {
        const mockChats = {
            chats: [
                { chat_id: 'id1', isu_1: 123456, isu_2: 2 },
                { chat_id: 'id2', isu_1: 123456, isu_2: 3 },
            ]
        };
        mockGetJson.mockResolvedValue(mockChats);

        const isu = 123456;
        const result = await getUserChats(isu);

        expect(mockGetJson).toHaveBeenCalledWith(`/chats/user_chats/${isu}`);
        expect(result).toEqual(mockChats.chats);
    });

    it('block user call postJson with correct data', async () => {
        const mockResponse = { message: 'user blocked, chat deleted' };
        mockPostJson.mockResolvedValue(mockResponse);

        const user_isu = 123456;
        const target_isu = 654321;
        const result = await blockPerson(user_isu, target_isu);

        expect(mockPostJson).toHaveBeenCalledWith(
            '/matches/block_person',
            { user_id: user_isu, target_id: target_isu }
        );
        expect(result).toEqual(mockResponse);
    });
});
