import { getJson } from ".";

export async function getChatsForUser(isu: number): Promise<{chats: {chat_id: string}[]}> {
    return await getJson<{chats: {chat_id: string} []}>(`/chats/user_chats/${isu}`);
}