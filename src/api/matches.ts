import { getJson } from ".";

export async function getUserChats(isu: number): Promise<{ chat_id: string; isu_1: number; isu_2: number }[]> {
  const response = await getJson<{ chats: { chat_id: string; isu_1: number; isu_2: number }[] }>(`/chats/user_chats/${isu}`);
  return response.chats;
}
