// tests/unit/chats.spec.ts
import {
    getUserContacts,
    getUserMessages,
    uploadMedia,
    sendMessage,
    getChatMessages,
    UserChat
} from '../../src/api/chats';
import { RawMessage } from '../../src/types';
import { getJson, postJson, request } from '../../src/api/index';
import { getProfile } from '../../src/api/profile';

jest.mock('../../src/api/index', () => ({
    __esModule: true,
    getJson: jest.fn(),
    postJson: jest.fn(),
    request: jest.fn(),
}));

jest.mock('../../src/api/profile', () => ({
    __esModule: true,
    getProfile: jest.fn(),
}));

// Мок глобального fetch для работы с media
global.fetch = jest.fn();

describe('chats.ts API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getUserContacts', () => {
        it('should process chats and return processed chats when return_profiles is false', async () => {
            const mockChats = {
                chats: [
                    { chat_id: 'chat1', isu_1: 123, isu_2: 456 },
                    { chat_id: 'chat2', isu_1: 456, isu_2: 123 },
                ],
            };
            (getJson as jest.Mock).mockResolvedValue(mockChats);
            const result = await getUserContacts(123, false);
            expect(getJson).toHaveBeenCalledWith('/chats/user_chats/123');
            expect(result).toEqual([
                { chat_id: 'chat1', isu_1: 123, isu_2: 456, userIsu: 'isu_1', otherIsu: 456 },
                { chat_id: 'chat2', isu_1: 456, isu_2: 123, userIsu: 'isu_2', otherIsu: 456 },
            ]);
        });

        it('should return profiles when return_profiles is true', async () => {
            const mockChats = {
                chats: [
                    { chat_id: 'chat1', isu_1: 123, isu_2: 456 },
                ],
            };
            (getJson as jest.Mock).mockResolvedValue(mockChats);
            const fakeProfile = { isu: 456, username: 'User456', bio: '', logo: '', photos: [] };
            (getProfile as jest.Mock).mockResolvedValue(fakeProfile);
            const result = await getUserContacts(123, true);
            expect(getJson).toHaveBeenCalledWith('/chats/user_chats/123');
            expect(getProfile).toHaveBeenCalledWith(456);
            expect(result).toEqual([fakeProfile]);
        });

        it('should throw error if chat does not include the user', async () => {
            const mockChats = {
                chats: [
                    { chat_id: 'chat1', isu_1: 789, isu_2: 456 },
                ],
            };
            (getJson as jest.Mock).mockResolvedValue(mockChats);
            await expect(getUserContacts(123, false)).rejects.toThrow('Unexpected: User ISU 123 not found in chat chat1');
        });
    });

    describe('getUserMessages', () => {
        it('should return raw messages without media', async () => {
            const mockMessages = {
                messages: [
                    {
                        message_id: 'msg1',
                        chat_id: 'chat1',
                        sender_id: 123,
                        receiver_id: 456,
                        text: 'Hello',
                        timestamp: '2020-01-01T00:00:00Z',
                    },
                ],
            };
            (getJson as jest.Mock).mockResolvedValue(mockMessages);
            const userContacts: UserChat[] = [{ chat_id: 'chat1', isu_1: 123, isu_2: 456 }];
            const result = await getUserMessages(userContacts);
            expect(result).toEqual([
                {
                    id: 'msg1',
                    chat_id: 'chat1',
                    sender_id: 123,
                    receiver_id: 456,
                    text: 'Hello',
                    timestamp: '2020-01-01T00:00:00Z',
                },
            ]);
        });

        it('should process media if media_id is provided', async () => {
            const mockMessages = {
                messages: [
                    {
                        message_id: 'msg2',
                        chat_id: 'chat1',
                        sender_id: 456,
                        receiver_id: 123,
                        text: 'Picture',
                        media_id: 'media1',
                        timestamp: '2020-01-01T00:01:00Z',
                    },
                ],
            };
            // Первый вызов: получение сообщений
            (getJson as jest.Mock)
                .mockResolvedValueOnce(mockMessages)
                // Второй вызов: получение media info
                .mockResolvedValueOnce({ url: "http://185.178.47.42:9000/somepath", media_type: "image" });
            // Замокаем fetch для получения blob
            const fakeBlob = new Blob(["fake image"], { type: "image/png" });
            (global.fetch as jest.Mock).mockResolvedValue({
                headers: { get: () => "image/png" },
                blob: async () => fakeBlob,
            });

            const userContacts: UserChat[] = [{ chat_id: 'chat1', isu_1: 456, isu_2: 123 }];
            const result = await getUserMessages(userContacts);
            expect(result[0]).toMatchObject({
                id: 'msg2',
                chat_id: 'chat1',
                sender_id: 456,
                receiver_id: 123,
                text: 'Picture',
                timestamp: '2020-01-01T00:01:00Z',
            });
            expect(result[0].image).toBe(fakeBlob);
        });
    });

    describe('uploadMedia', () => {
        it('should call request and return media_id', async () => {
            const fakeMediaId = "media123";
            (request as jest.Mock).mockResolvedValue({
                json: async () => ({ media_id: fakeMediaId }),
            });
            const fakeFile = new File(["content"], "test.png", { type: "image/png" });
            const result = await uploadMedia(123, "chat1", fakeFile, "image");
            expect(request).toHaveBeenCalledWith("/chats/upload_media", expect.objectContaining({
                method: 'POST',
            }));
            expect(result).toBe(fakeMediaId);
        });
    });

    describe('sendMessage', () => {
        it('should send message without media', async () => {
            const fakeMessageId = "msg123";
            (postJson as jest.Mock).mockResolvedValue({ message_id: fakeMessageId });
            const result = await sendMessage("chat1", 123, 456, "Hello");
            expect(postJson).toHaveBeenCalledWith("/chats/send_message", {
                chat_id: "chat1",
                sender_id: 123,
                receiver_id: 456,
                text: "Hello",
            });
            expect(result).toBe(fakeMessageId);
        });


    });

    describe('getChatMessages', () => {
        it('should return raw messages for a given chat', async () => {
            const mockData = {
                messages: [
                    {
                        message_id: "msg1",
                        chat_id: "chat1",
                        sender_id: 123,
                        receiver_id: 456,
                        text: "Hello",
                        timestamp: "2020-01-01T00:00:00Z"
                    }
                ]
            };
            (getJson as jest.Mock).mockResolvedValue(mockData);
            const result = await getChatMessages("chat1", 150, 0);
            expect(getJson).toHaveBeenCalledWith("/chats/get_messages/chat1?limit=150&offset=0");
            expect(result).toEqual([
                {
                    id: "msg1",
                    chat_id: "chat1",
                    sender_id: 123,
                    receiver_id: 456,
                    text: "Hello",
                    timestamp: "2020-01-01T00:00:00Z"
                }
            ]);
        });
    });
});
